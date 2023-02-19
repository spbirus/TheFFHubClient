import React from 'react';
import { LeagueContext } from '../Contexts/LeagueContexts';
import { ILeagueMetadata, Site } from '../models';
import { LinkType } from './models'
import Select from 'react-select';
import { convertSiteToText, verifyLeagueExists } from '../leagueApi';

export default function AddLeagueCard() {
	const leagues = React.useContext(LeagueContext);

    const [leagueToAdd, setLeagueToAdd] = React.useState<ILeagueMetadata>(
        {
            site: "espn",
            leagueId: "",
            name: "",
            userId: "",
            swid: "",
            s2: ""
        }
    );
    
	const [selectedSite, setSelectedSite] = React.useState(Site.ESPN);

    const showYahooAuthentication = selectedSite == Site.Yahoo;

    const addLeagueButtonDisabled = !leagueToAdd.name || !leagueToAdd.leagueId;

    const siteUrlImage = () => {
        if(selectedSite == Site.ESPN){
            return <img src="/espnurl.PNG" alt="image" />
        }
        if(selectedSite == Site.Yahoo){
            return <img src="/yahooUrl.PNG" alt="image" />
        }
        if(selectedSite == Site.Sleeper){
            return <img src="/sleeperUrl.png" alt="image" />
        }
        return <span></span>;
    }

    const privateLeagueUri = (type: LinkType) => {
        switch(type){
            case LinkType.PlayoffMachine:
                return "Playoff Machine";
            case LinkType.PlayoffOdds:
                return "Playoff Odds";
            case LinkType.PowerRankings:
                return "Power Rankings";
            case LinkType.Scheduler:
                return "Schedule Comparison";
            default:
                return "Playoff Machine";
        }
    }
    
    const options = [
        { value: Site.ESPN, label: 'ESPN' },
        { value: Site.Yahoo, label: 'Yahoo' },
        { value: Site.Sleeper, label: 'Sleeper' }
    ]

    const handleLeagueIdChange = (s: string) => {
        setLeagueToAdd({
            ...leagueToAdd,
            leagueId: s
        });
    }

    const handleNameChange = (s: string) => {
        setLeagueToAdd({
            ...leagueToAdd,
            name: s
        });
    }

	const handleAddLeague = () => {
            const fetchData = async () => {
                const leagueExists = await verifyLeagueExists(
                    {
                        site: leagueToAdd.site,
                        leagueId: leagueToAdd.leagueId,
                        userId: "",
                        swid: "",
                        s2: ""
                    }
                );
                if(leagueExists){
                    var updatedLeagues = [...leagues.leagues, leagueToAdd]
		            leagues.setLeagues(updatedLeagues);
                    setLeagueToAdd({
                        site: leagueToAdd.site,
                        leagueId: "",
                        name: "",
                        userId: "",
                        swid: "",
                        s2: ""
                    });
                }else{
                    console.log("failure");
                }
            }
            fetchData();
            
	}

    
    const handleSiteSelectedChange = (s: Site) => {
        setLeagueToAdd({
            ...leagueToAdd,
            site: convertSiteToText(s)
        });
        setSelectedSite(s);
    }

    return (
        <div>
		Select the site your league is on: <br />
		<Select options={options} value = { options.filter(option => option.value === selectedSite)} onChange={s =>handleSiteSelectedChange(s?.value || Site.ESPN)}/>
		{ !showYahooAuthentication &&
            <span>
                <span style={{paddingTop:100}}>Grab the league ID from the URL of your league (see image below for more details):</span> <br />

                <input placeholder="League ID" type="text" value={leagueToAdd.leagueId || ''} onChange={s=> handleLeagueIdChange(s.target.value)} /> {siteUrlImage()}<br />

                <span style={{marginTop: 100}}>Add a name to remember your league by: </span><br />
                <input placeholder="Name of the league" type="text" value={leagueToAdd.name || ''} onChange={s=> handleNameChange(s.target.value)}/> <br />
                <button className="btn btn-success" onClick={handleAddLeague} disabled={addLeagueButtonDisabled} style={{marginTop:10}}>Add</button>
            </span>
        }
		{ showYahooAuthentication &&
            <span >
                <button className="btn btn-success" ng-click="yahooLogin()">Authenticate with Yahoo</button>
            </span>
        }
		</div>
    )
}
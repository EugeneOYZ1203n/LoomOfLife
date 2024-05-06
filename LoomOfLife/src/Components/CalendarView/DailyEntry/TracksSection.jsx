import { invoke } from "@tauri-apps/api/tauri";
import "./TracksSection.css";
import { useEffect, useState } from "react";

function TracksSection({canEdit, contents, editFileFunc}) {
  const [tracks, setTracks] = useState([]);
  const [hasParsedContents, setHasParsedContents] = useState(false);
  
  //Parsing from save file
  useEffect(()=>{
    const trackStrings = contents.match(/(?<=\()(.*?:.*?)(?=\))/mg);

    if (trackStrings){
      const parsedTracks = trackStrings.map(el=> {
        const [trackName, trackNumString] = el.split(':');
        const x = parseFloat(trackNumString.trim());
        const trackNum = x?x:0;

        return {trackName, trackNum}
      })

      setTracks(parsedTracks);
    }

    setHasParsedContents(true);

  }, [contents])

  const editTrack = (index, newTrack)=>{
    let newTracks = [...tracks];
    newTracks[index] = newTrack;
    setTracks(newTracks);
  }

  useEffect(()=>{
    if (!hasParsedContents){
      return;
    }

    let newContent = tracks.reduce((acc,track)=>{
      acc += `(${track.trackName}:${track.trackNum})\n`;
      return acc;
    }, "")

    editFileFunc("Tracks", newContent);

  }, [tracks])

  return (
    <div>
      {tracks.map((el,i)=>{
        return <div key={i} className={`TracksSection ${!canEdit&&"TracksSection_Disabled"}`}>
          <p className="TracksSection_Label">{el.trackName}:</p>  
          <input 
            disabled={!canEdit}
            className="TracksSection_Input"
            type="number"
            value={el.trackNum}
            onChange={(e)=>{editTrack(i, {
              ...el, trackNum: e.target.value
            })}}/>
        </div>
      })}
    </div>
  );
}

export default TracksSection;
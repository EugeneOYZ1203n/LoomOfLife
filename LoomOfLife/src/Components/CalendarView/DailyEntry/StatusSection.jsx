import { invoke } from "@tauri-apps/api/tauri";
import "./StatusSection.css";
import { useContext, useEffect, useState } from "react";
import Select from 'react-select';
import Creatable, { useCreatable } from 'react-select/creatable';
import { ConfigTextContext } from "../CalendarView";
import { parseTagContents, replaceTagContents } from "../../Helper";

const moodOptions = ['Stressed', 'Sad', 'Meh', 'Happy', 'Excited'];
const healthTagOptions = ['Hospitalized', 'Sick', 'Tired', 'Healthy'];

const toOptionsObj = (options) => {
  return options.map((el)=>{return {value: el, label: el}})
}
const fromOptionsObj = (optionsObj)=> {
  return optionsObj.map((el)=>{return el.value})
}
const toAOptionObj = (option) => {
  return {value: option, label: option}
}

function StatusSection({canEdit, contents, editFileFunc}) {
  const [mood, setMood] = useState('Meh');
  const [health, setHealth] = useState({
    tag: 'Healthy',
    illness: ""
  });
  const [tags, setTags] = useState([]);
  const [configText, writeConfigText] = useContext(ConfigTextContext);

  const [illnessOptions, setIllnessOptions] = useState([]);
  const [tagsOptions, setTagsOptions] = useState([]);

  const [hasParsedContents, setHasParsedContents] = useState(false);
  const [checkedConfig, setCheckedConfig] = useState(false);

  //Parsing contents
  useEffect(()=>{
    const parseContents = (content) => {
      if (!content){
        return; //Uses default state values
      }

      const moodVal = content.match(/(?<=Mood:).*(?=;)/);
      if (moodVal){
        setMood(moodVal[0].trim());
      }
      
      const healthVal = content.match(/(?<=Health:).*(?=;)/);
      if (healthVal) {
        let arr = healthVal[0].trim().split('/');
        let newHealth = {
          tag: arr.length > 0?arr[0].trim(): 'Healthy',
          illness: arr.length > 1?arr[1].trim():""
        }
        setHealth(newHealth);
      }

      const tagsVal = content.match(/(?<=Tags:).*(?=;)/);
      if (tagsVal) {
        if (tagsVal[0].trim() == '') return;

        let newTags = tagsVal[0].trim().split(' ').map((el)=>el.trim());

        setTags(newTags);
      }
    }
    
    parseContents(contents);

    setHasParsedContents(true);
  }, [contents])

  // Getting illness and tag options
  useEffect(()=>{
    if (!configText){
      return;
    }

    let illnessesMatch = parseTagContents(configText, "Status Illnesses");
    if (illnessesMatch){
      setIllnessOptions(illnessesMatch.split('\n').map(el=>el.trim()));
    }

    let tagsMatch = parseTagContents(configText, "Status Tags");
    if (tagsMatch) {
      setTagsOptions(tagsMatch.split('\n').map(el=>el.trim()))
    }

    setCheckedConfig(true);

  }, [configText])

  // Updating config
  useEffect(()=>{
    if (!checkedConfig){
      return;
    }

    let newConfig = configText;
    newConfig = replaceTagContents(
      newConfig, 
      illnessOptions.reduce((acc,el)=>`${acc}${el}\n`, "\n"), 
      "Status Illnesses");
    newConfig = replaceTagContents(
      newConfig, 
      tagsOptions.reduce((acc,el)=>`${acc}${el}\n`, "\n"), 
      "Status Tags");

    writeConfigText(newConfig);
  }, [illnessOptions, tagsOptions])

  // Writing to save file
  useEffect(()=>{
    if (!hasParsedContents){
      return;
    }

    let newContent = "";

    newContent += `Mood: ${mood};\n`;
    newContent += `Health: ${health.tag} / ${health.illness};\n`;
    newContent += `Tags: ${tags.reduce((acc,el)=>acc+" "+el, "")};\n`;

    editFileFunc("Status", newContent);

  }, [mood, health, tags])

  return (
    <div className={`StatusSection ${canEdit?"":"StatusSection_Disabled"}`}>
      <div className="StatusSection_Mood">
        <p className="StatusSection_Label">Mood:</p> 
        <Select 
          unstyled
          isDisabled={!canEdit}
          classNamePrefix="StatusSection_Select"
          options={toOptionsObj(moodOptions)} 
          value={toAOptionObj(mood)} 
          onChange={(e)=>{setMood(e.value)}}/>
      </div>
      <div className="StatusSection_Health">
        <p className="StatusSection_Label">Health:</p> 
        <Select 
          unstyled
          isDisabled={!canEdit}
          classNamePrefix="StatusSection_Select"
          options={toOptionsObj(healthTagOptions)} 
          value={toAOptionObj(health.tag)} 
          onChange={(e)=>{
            setHealth({tag: e.value, illness: e.value=="Healthy"?"":health.illness});}}/>
        
        {(health.tag=='Sick'||health.tag=='Hospitalized') && 
        <Creatable
          unstyled
          isDisabled={!canEdit}
          classNamePrefix="StatusSection_Select"
          options={toOptionsObj(illnessOptions)}
          onCreateOption={(input)=>{
            setIllnessOptions([...illnessOptions, input]);
            setHealth({...health, illness: input});
          }}
          value={toAOptionObj(health.illness)} 
          onChange={(e)=>{setHealth({...health, illness: e.value})}}/>}
      </div>
      <div className="StatusSection_Tags">
        <p className="StatusSection_Label">Tags:</p> 
        <Creatable 
          unstyled
          isDisabled={!canEdit}
          classNamePrefix="StatusSection_Select"
          isMulti={true}
          options={toOptionsObj(tagsOptions)}
          onCreateOption={(input)=>{
            console.log(input);
            setTagsOptions([...tagsOptions, ...input.split(' ').map(el=>el.trim())]);
            setTags([...tags, ...input.split(' ').map(el=>el.trim())]);
          }}
          value={tags.length>0?tags.map(el=>toAOptionObj(el)):[]} 
          onChange={(e)=>{setTags(fromOptionsObj(e))}}/>
      </div>
    </div>
  );
}

export default StatusSection;
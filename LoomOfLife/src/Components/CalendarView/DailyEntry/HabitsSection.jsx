import { invoke } from "@tauri-apps/api/tauri";
import "./HabitsSection.css";
import { useState, useEffect } from "react";

function HabitsSection({canEdit, contents, editFileFunc}) {
  const [habits, setHabits] = useState([]);
  const [hasParsedContents, setHasParsedContents] = useState(false);
  
  //Parsing from save file
  useEffect(()=>{
    const habitStrings = contents.match(/{(.*?)}[YN]/g);

    if (habitStrings){
      const parsedHabits = habitStrings.map(el=> {
        const habitName = el.match(/(?<={).*(?=})/)[0];
        const done = el.slice(-1) == "Y"?true:false;

        return {habitName, done}
      })

      setHabits(parsedHabits);
    }

    setHasParsedContents(true);

  }, [contents])

  const editHabit = (index, newHabit) => {
    let newHabits = [...habits];
    newHabits[index] = newHabit;
    setHabits(newHabits)
  }

  useEffect(()=>{
    if (!hasParsedContents){
      return;
    }

    let newContent = habits.reduce((acc,habit)=>{
      acc += `{${habit.habitName}}${habit.done?"Y":"N"}\n`;
      return acc;
    }, "")

    editFileFunc("Habits", newContent);

  }, [habits])
  
  return (
    <div className="HabitsSection">
      {habits.map((habit, i)=>{
        return <div className="HabitsSection_Item" key={i}>
          <div className="HabitsSection_Row">
            <input 
              disabled={!canEdit}
              className="HabitsSection_Checkbox"
              type="checkbox" checked={habit.done}
              onChange={(e)=>editHabit(i, {
                ...habit, done: e.target.checked
              })}/>
            <p className="HabitsSection_Name">{habit.habitName}</p>
          </div>
        </div>
      })}
    </div>
  );
}

export default HabitsSection;
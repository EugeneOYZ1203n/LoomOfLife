import { invoke } from "@tauri-apps/api/tauri";
import "./TasksSection.css";
import { useEffect, useState } from "react";
import TextareaAutosize from 'react-textarea-autosize';

function TasksSection({canEdit, contents, editFileFunc}) {
  const [tasks, setTasks] = useState([]);
  const [hasParsedContents, setHasParsedContents] = useState(false);
  
  //Parsing from save file
  useEffect(()=>{
    const taskStrings = contents.match(/{(.*?)}\([\s\S]*?\)[YN][NM]/mg);

    if (taskStrings){
      const parsedTasks = taskStrings.map(el=> {
        const taskName = el.match(/(?<={).*(?=})/)[0];
        const desc = el.match(/(?<=\()[\s\S]*(?=\))/)[0];
        const minimize = el.slice(-1) == "M"?true:false;
        const done = el.slice(-2,-1) == "Y"?true:false;

        return {taskName, desc, minimize, done}
      })

      setTasks(parsedTasks);
    }

    setHasParsedContents(true);

  }, [contents])
  
  const editTask = (index, newTask) => {
    let newTasks = [...tasks];
    newTasks[index] = newTask;
    
    setTasks(newTasks);
  }

  const deleteTask = (index) => {
    let newTasks = [...tasks];
    newTasks.splice(index, 1);
    
    setTasks(newTasks);
  }

  const addTask = () => {
    setTasks([...tasks, {
      taskName: "",
      desc: "",
      minimize: true,
      done: false
    }]);
  }

  useEffect(()=>{
    if (!hasParsedContents){
      return;
    }

    let newContent = tasks.reduce((acc,task)=>{
      acc += `{${task.taskName}}(${task.desc})${task.done?"Y":"N"}${task.minimize?"M":"N"}\n`;
      return acc;
    }, "")

    editFileFunc("Tasks", newContent);

  }, [tasks])


  return (
    <div className="TaskSection">
      {tasks.map((task, i)=>{
        return <div className="TaskSection_Item" key={i}>
          
          <div className="TaskSection_Column">
            <div className="TaskSection_Row">
              <input 
              className="TaskSection_Checkbox"
              type="checkbox" checked={task.done}
              onChange={(e)=>editTask(i, {
                ...task, done: e.target.checked
              })}/>
              <input 
                className="TaskSection_TaskName"
                value={task.taskName}
                onChange={(e)=>editTask(i, {
                  ...task, taskName: e.target.value
                })}/>
              <button className="TaskSection_MinimizeBtn" onClick={(e)=>editTask(i, {
                ...task, minimize: !task.minimize
              })}>
                -
              </button>
              <button className="TaskSection_DeleteBtn" onClick={(e)=>deleteTask(i)}>
                x
              </button>
            </div>
            {!task.minimize && <TextareaAutosize className="TaskSection_Description"
              value={task.desc}
              onChange={(e)=>editTask(i, {
                ...task, desc: e.target.value
              })}/>}
          </div>
        </div>
      })}

      <button className="TaskSection_AddBtn" onClick={(e)=>addTask()}>
        +
      </button>
    </div>
  );
}

export default TasksSection;
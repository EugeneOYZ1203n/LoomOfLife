import { invoke } from "@tauri-apps/api/tauri";
import "./TasksSection.css";
import { useEffect, useState } from "react";
import TextareaAutosize from 'react-textarea-autosize';

function TasksSection({canEdit, contents, editFileFunc}) {
  const [tasks, setTasks] = useState([]);
  const [hasParsedContents, setHasParsedContents] = useState(false);
  
  //Parsing from save file
  useEffect(()=>{
    const taskStrings = contents.match(/{.*?:(.*?)}\([\s\S]*?\)[YN]/mg);

    if (taskStrings){
      const parsedTasks = taskStrings.map(el=> {
        const [projectName, taskName] = el.match(/(?<={).*(?=})/)[0].split(':');
        const desc = el.match(/(?<=\()[\s\S]*(?=\))/)[0];
        const minimize = desc == "";
        const done = el.slice(-1) == "Y"?true:false;

        return {projectName, taskName, desc, minimize, done}
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
      projectName: "",
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
      acc += `{${task.projectName}:${task.taskName}}(${task.desc})${task.done?"Y":"N"}\n`;
      return acc;
    }, "")

    editFileFunc("Tasks", newContent);

  }, [tasks])


  return (
    <div>
      {tasks.map((task, i)=>{
        return <div key={i}>
          <input 
            type="checkbox" checked={task.done}
            onChange={(e)=>editTask(i, {
              ...task, done: e.target.checked
            })}/>
          <input 
            value={task.projectName}
            onChange={(e)=>editTask(i, {
              ...task, projectName: e.target.value
            })}/>
          <input 
            value={task.taskName}
            onChange={(e)=>editTask(i, {
              ...task, taskName: e.target.value
            })}/>
          <button onClick={(e)=>editTask(i, {
            ...task, minimize: !task.minimize
          })}>
            -
          </button>
          <button onClick={(e)=>deleteTask(i)}>
            x
          </button>
          {!task.minimize && <TextareaAutosize
            value={task.desc}
            onChange={(e)=>editTask(i, {
              ...task, desc: e.target.value
            })}/>}
        </div>
      })}

      <button onClick={(e)=>addTask()}>
        +
      </button>
    </div>
  );
}

export default TasksSection;
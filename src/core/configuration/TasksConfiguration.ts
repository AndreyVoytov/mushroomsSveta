import { TasksConfigurationData } from "../model/task/TaskModels";

declare const require: any;

const tasksConfiguration = <TasksConfigurationData>require("./tasks.json");

export default tasksConfiguration;

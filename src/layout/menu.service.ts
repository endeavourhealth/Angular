import {MenuOption} from "./models/MenuOption";

export abstract class MenuService {
	abstract getMenuOptions() : MenuOption[];
	abstract getApplicationTitle() : string;
}
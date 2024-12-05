import inquirer from "inquirer";
import AuthManager from "../managers/AuthManager.js";
import MainMenu from "./MainMenu.js";
import WalletMenu from "./WalletMenu.js";


async function ItuScanMenu() {

    const { choice } = await inquirer.prompt([
      {
        type: "list",
        name: "choice",
        message: "Main Menu",
        choices: ["0x9s1gf1f9s3..123s", "Return Main Menu"]
      }
    ]);
  
    if (choice === "0x9s1gf1f9s3..123s") {
      await WalletMenu(choice);
    }else if(choice === "Return Main Menu"){}
}

export default ItuScanMenu;
import axios from "axios";
import dotenv from "dotenv";
import { Command } from "commander";

dotenv.config();

const SERVER_URL = process.env.SERVER_URL as string;
const API_TOKEN = process.env.API_TOKEN as string;

if (!SERVER_URL || !API_TOKEN) {
    console.error("❌ SERVER_URL or API_TOKEN is missing in the environment variables.");
    process.exit(1);
}

// Interface pour les commandes MDM
interface MDMCommand {
    udid: string;
    request_type: string;
    identifier?: string;
    change_management_state?: string;
    queries?: string[];
}

/**
 * Envoie une requête à MicroMDM
 */
async function sendCommand(command: MDMCommand): Promise<void> {
    const endpoint = "v1/commands";

    try {
        console.log("Command being sent:", JSON.stringify(command, null, 2));
        const response = await axios.post(`${SERVER_URL}/${endpoint}`, command, {
            auth: {
                username: "micromdm",
                password: API_TOKEN,
            },
            headers: {
                "Content-Type": "application/json",
            },
        });

        console.log("✅ Command sent successfully:", response.data);
    } catch (error: any) {
        console.error("❌ Error:", error.response ? error.response.data : error.message);
    }
}

// Initialisation du CLI avec commander
const program = new Command();

program
    .name("mdmCommands")
    .description("CLI tool to send MDM commands via MicroMDM")
    .version("1.0.0");

program
    .command("device-info")
    .description("Get the information of a device")
    .argument("<udid>", "Device UDID")
    .argument("[queries...]", "List of queries to request")
    .action((udid: string, queries: string[]) => {
        const command: MDMCommand = {
            udid,
            request_type: "DeviceInformation",
            queries: queries ?? []
        };
        sendCommand(command);
    });

program
    .command("installed-apps")
    .description("Get the list of installed applications")
    .argument("<udid>", "Device UDID")
    .action((udid: string) => {
        const command: MDMCommand = {
            udid,
            request_type: "InstalledApplicationList",
        };
        sendCommand(command);
    });

program
    .command("install-app")
    .description("Install an application on the device")
    .argument("<udid>", "Device UDID")
    .argument("<identifier>", "Application identifier (Bundle ID)")
    .action((udid: string, identifier: string) => {
        const command: MDMCommand = {
            udid,
            request_type: "InstallApplication",
            identifier,
            change_management_state: "Managed"
        };
        sendCommand(command);
    });

program.parse(process.argv);
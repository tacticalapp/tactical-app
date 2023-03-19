import { isMainnet } from "../utils/chain";
import { TacticalClient } from "./TacticalClient";

export let tacticalClient = new TacticalClient(isMainnet ? 'https://tactical-server.herokuapp.com' : 'https://tactical-testnet-server.herokuapp.com');
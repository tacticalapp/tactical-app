import { TacticalClient } from "./TacticalClient";

export let client = new TacticalClient(import.meta.env.DEV ? 'http://localhost:3001' : 'https://tactical-server.herokuapp.com');
import { connection } from "./connection.js";

export class TeamService {

	constructor() {		 
		this.tableName = "teams";
	}

	all() {
		return connection.select({
			from: this.tableName,
		})
	}

	store(team) {
    team = {
      name: team.name,
      type: team.type,
      total_scores: 0,
      created_at: new Date(),
      updated_at: new Date(),
    }
		return connection.insert({
			into: this.tableName,
			values: [team],
			return: true
		})
	}

	retrieve(id) {
		return connection.select({
			from: this.tableName,
			where: {
				id: id
			}
		})
	}

	destroy(id) {
		return connection.remove({
			from: this.tableName,
			where: {
				id: id
			}
		})
	}

	update(id, team) {
		return connection.update({
			in: this.tableName,
			set: team,
			where: {
				id: id
			}
		})
	}

}
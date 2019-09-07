import { connection } from "../connection.js";

export class TeamService {

	constructor() {		 
		this.tableName = "team";
	}

	store(team) {
		if (!team.total_scores) {
			team.total_scores = 0;
		}
		return connection.insert({
			into: this.tableName,
			values: [team],
			return: true
		})
	}

  all() {
		return connection.select({
			from: this.tableName,
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

  filter(where = null, order = null) {
    var data = { from: this.tableName };
    if (where !== null) {
      data.where = where;
    }
    if (order !== null) {
      data.order = order;
    }
		return connection.select(data);
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
import { connection } from "../connection.js";

export class BattleTeamService {

	constructor() {		 
		this.tableName = "battle_team";
	}

	store(battleTeam) {
    if (!battleTeam.total_scores) {
			battleTeam.total_scores = 0;
		}
		return connection.insert({
			into: this.tableName,
			values: [battleTeam],
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

	update(id, battleTeam) {
		return connection.update({
			in: this.tableName,
			set: battleTeam,
			where: {
				id: id
			}
		})
	}

}
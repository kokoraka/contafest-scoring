import { connection } from "../connection.js";

export class BattleService {

	constructor() {		 
		this.tableName = "battle";
	}

	store(battle) {
		if (!battle.total_scores) {
			battle.total_scores = 0;
		}
		for (var i = 0; i < battle.teams.length; i++) {
			let id = battle.teams[i];
			battle.teams[i] = {
				team_id: id,
				total_scores: 0
			};
		}
		return connection.insert({
			into: this.tableName,
			values: [battle],
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

	update(id, battle) {
		return connection.update({
			in: this.tableName,
			set: battle,
			where: {
				id: id
			}
		})
	}

}
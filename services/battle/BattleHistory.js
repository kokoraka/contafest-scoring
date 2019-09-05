import { connection } from "../connection.js";

export class BattleHistoryService {

	constructor() {		 
		this.tableName = "battle_history";
	}

	store(battleHistory) {
    if (!battleHistory.total_scores) {
			battleHistory.total_scores = 0;
		}
		return connection.insert({
			into: this.tableName,
			values: [battleHistory],
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

	update(id, battleHistory) {
		return connection.update({
			in: this.tableName,
			set: battleHistory,
			where: {
				id: id
			}
		})
	}

}
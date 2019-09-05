import { connection } from "../connection.js";
import { BattleTeamService } from "./BattleTeam.js";

export class BattleService {

	constructor() {		 
		this.tableName = "battle";
	}

  async play(battle) {
		var result = await connection.transaction({
			tables: ['battle', 'battle_team'],
			logic: async function(ctx) {
				start();
				setResult('battle', {});
				const insertedBattle = await ctx.insert({
					into: this.tableName,
					values: [ ctx.data.battle ],
					return: true
				});
				const battle = insertedBattle[0];
				const battleTeam = ctx.data.teams.map((team) => {
					return {
						total_scores: 0,
						team_id: team,
						battle_id: battle.id,						
					};
				});
				const insertedBattleTeam = await ctx.insert({
					into: 'battle_team',
					values: battleTeam,
					return: true
				})
				setResult('battle', {'battle': battle, 'battle_team': insertedBattleTeam});
			},
			data: {
				battle: {
					name: battle.name,
					type: battle.type,
					total_scores: 0,
				},
				teams: battle.teams
			}
		});
		return result.battle;
  }

	store(battle) {
    if (!battle.total_scores) {
			battle.total_scores = 0;
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
			// join: [
			// 	{
			// 		with: "team",
			// 		on: "team.id=battle.teams.",
			// 		as: {
			// 				customerId: table2_customerId
			// 		} 
			// 	}
			// ]
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
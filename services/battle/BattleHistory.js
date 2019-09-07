import { connection } from "../connection.js";

export class BattleHistoryService {

	constructor() {		 
		this.tableName = "battle_history";
	}

	async play(battle) {
		return await connection.transaction({
			tables: ['battle', 'battle_history', 'battle_team', 'team'],
			logic: async function(ctx) {
				ctx.start();
				ctx.setResult('battle', {});
				const insertedBattleHistory = await ctx.insert({
					into: 'battle_history',
					values: [ ctx.data.battleHistory ],
					return: true
				});
				const battleHistory = insertedBattleHistory[0];

				const battleTeam = await ctx.select({
					from: "battle_team",
					where: {
						id: ctx.data.battleTeam.id
					}
				});
				const updatedBattleTeam = await ctx.update({
					in: "battle_team",
					set: {
						total_scores: (battleTeam[0].total_scores + ctx.data.battleHistory.score),
						updated_at: new Date()
					},
					where: {
						id: ctx.data.battleTeam.id,
					}
				});

				const battle = await ctx.select({
					from: "battle",
					where: {
						id: ctx.data.battleHistory.battle_id
					}
				});
				const updatedBattle = await ctx.update({
					in: "battle",
					set: {
						total_scores: (battle[0].total_scores + ctx.data.battleHistory.score),
						updated_at: new Date()
					},
					where: {
						id: ctx.data.battleHistory.battle_id,
					}
				});

				const team = await ctx.select({
					from: "team",
					where: {
						id: ctx.data.battleHistory.team_id
					}
				});
				const updatedTeam = await ctx.update({
					in: "team",
					set: {
						total_scores: (team[0].total_scores + ctx.data.battleHistory.score),
						updated_at: new Date()
					},
					where: {
						id: ctx.data.battleHistory.team_id,
					}
				});

				ctx.setResult('battle', {
					'battle_history': battleHistory,
					'battle_team': updatedBattleTeam,
					'battle': updatedBattle,
					'team': updatedTeam
				});
			},
			data: {
				battleHistory: {
					team_id: battle.team_id,
					battle_id: battle.battle_id,
					score: battle.score
				},
				battleTeam: {
					id: battle.battle_team_id
				},
				team: {
					id: battle.team_id
				}
			}
    });
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
window.$ = window.jQuery;

import { connection } from "./services/connection.js";
import { TeamService } from "./services/team/Team.js";
import { BattleService } from "./services/battle/Battle.js";
import { BattleTeamService } from "./services/battle/BattleTeam.js";
import { BattleHistoryService } from "./services/battle/BattleHistory.js";

Vue.component('toast', {
  template: `
  <div class="toast" role="alert" aria-live="assertive" 
    aria-atomic="true" data-autohide="false">
    <div class="toast" role="alert" data-delay="5000"
      style="position: fixed; top: 10px; right: 10px;">
      <div class="toast-header bg-warning text-dark">
        <!-- <img src="" class="rounded mr-2" alt=""> -->
        <strong class="mr-auto">{{ toast.title }}</strong>
        <small class="text-dark">{{ toast.description }}</small>
        <button type="button" class="ml-2 mb-1 close" 
          data-dismiss="toast" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="toast-body">
        {{ toast.content }}
      </div>
    </div>
  </div>`,
	data() {
    return {
      toast: {
        title: 'Wei de dong Tian',
        description: 'Confucius.ID',
        content: 'Kunjungi terus Confucius.ID, ada pendidikan tiada perbedaan',        
      }
    }
	},
  props: [
    'title', 'description', 'content'
  ],
  mounted: function() {
    this.setProps();
  },
  methods: {
    setProps() {
      this.toast.title = this.title;
      this.toast.description = this.description;
      this.toast.content = this.content;
    },
    setTitle(title) {
      this.toast.title = title;
      return this;
    },
    setDescription(description) {
      this.toast.description = description;
      return this;
    },
    setContent(content) {
      this.toast.content = content;
      return this;
    },
    setData(data) {
      if (data && data.title) {
        this.setTitle(data.title);
      }
      if (data && data.description) {
        this.setDescription(data.description);
      }
      if (data && data.content) {
        this.setContent(data.content);
      }
      return this;
    },
    open() {
      $('.toast').toast('show');
    },
    close() {
      $('.toast').toast('hide');
    }
  },
  watch: {},
  computed: {}
});

new Vue({
  el: '#app',
  data: {
    connection: {},
    database: {
      contafest: {
        setting: {
          name: 'contafest',
          version: 1,
          tables: [
            {
              name: 'team',
              columns: {
                id: { primaryKey: true, autoIncrement: true, dataType: "number" },
                name: { notNull: true, dataType: "string" },
                type: { notNull: true, dataType: "string" },
                total_scores : { notNull: true, dataType: "number", default: 0 },
                // members: { notNull: true, dataType: 'array' },
                created_at: { notNull: true, dataType: 'date_time', default: new Date() },
                updated_at: { notNull: true, dataType: 'date_time', default: new Date() },
              }
            },
            {
              name: 'battle',
              columns: {
                id: { primaryKey: true, autoIncrement: true, dataType: "number" },
                name: { notNull: true, dataType: "string" },
                type: { notNull: true, dataType: "string" },
                total_scores : { notNull: true, dataType: "number", default: 0 },
                created_at: { notNull: true, dataType: 'date_time', default: new Date() },
                updated_at: { notNull: true, dataType: 'date_time', default: new Date() },
              }
            },
            {
              name: 'battle_team',
              columns: {
                id: { primaryKey: true, autoIncrement: true, dataType: "number" },
                total_scores : { notNull: true, dataType: "number", default: 0 },
                team_id: { notNull: true, dataType: "number" },
                battle_id: { notNull: true, dataType: "number" },
                created_at: { notNull: true, dataType: 'date_time', default: new Date() },
                updated_at: { notNull: true, dataType: 'date_time', default: new Date() },
              }
            },
            {
              name: 'battle_history',
              columns: {
                id: { primaryKey: true, autoIncrement: true, dataType: "number" },
                score : { notNull: true, dataType: "number" },
                team_id: { notNull: true, dataType: "number" },
                battle_id: { notNull: true, dataType: "number" },
                created_at: { notNull: true, dataType: 'date_time', default: new Date() },
                updated_at: { notNull: true, dataType: 'date_time', default: new Date() },
              }
            }
          ]
        }
      },
    },
    newTeam: {
      name: '',
      type: 'A',
    },
    teams: [],
    teamsA: [],
    teamsB: [],
    newBattle: {
      name: '',
      type: 'A',
      teams: [],
    },
    battles: []
  },
  mounted: function() {
    this.openConnection();
    this.setDatabaseContafest();    
    this.refreshTeam();
    this.refreshBattle();
  },
  methods: {
    getRandomNumber: function(max) {
      return Math.floor(Math.random() * max);
    },
    openConnection: function() {
      this.connection = connection;
    },
    setDatabaseContafest: async function() {
      return await this.connection.initDb({
        name: this.database.contafest.setting.name,
        tables: this.database.contafest.setting.tables
      });
    },
    refreshTeam: function() {
      this.fetchTeam();
      this.fetchTeamA();
      this.fetchTeamB();
    },
    fetchTeam: async function() {
      this.teams = [];
      try {
        const results = await new TeamService().filter(
          null,
          [
            { by: 'total_scores', type: 'desc' },
            { by: 'name', type: 'asc' }
          ]
        );
        this.teams = results;
      } catch (e) {
        console.log(e);
      }
    },
    fetchTeamA: async function() {
      this.teamsA = [];
      try {
        const results = await new TeamService().filter(
          { type: 'A' },
          [
            { by: 'total_scores', type: 'desc' },
            { by: 'name', type: 'asc' }
          ]
        );
        this.teamsA = results;
      } catch (e) {
        console.log(e);       
      }
    },
    fetchTeamB: async function() {
      this.teamsB = [];
      try {
        const results = await new TeamService().filter(
          { type: 'B' },
          [
            { by: 'total_scores', type: 'desc' },
            { by: 'name', type: 'asc' }
          ]
        );
        this.teamsB = results;
      } catch (e) {
        console.log(e);
      }
    },
    resetNewTeam: function() {
      this.newTeam = {
        name: '',
        type: '',
      };
    },
    fireAddTeam: async function() {
      $('#modalAddTeam').modal('hide');
      var nameLength = this.newTeam.name.length;
      if (nameLength > 0 && nameLength <= 15) {
        try {
          const results = await new TeamService().store(this.newTeam);        
          if (results && results.length > 0) {
            this.refreshTeam();
            this.resetNewTeam();
            var curr = this;
            results.forEach(team => {
              curr.showToast({
                title: 'Sukses',
                description: 'Confucius.ID',
                content: 'Berhasil menambahkan tim ' + team.name
              });
            });
          }
          else {
            this.showToast({
              title: 'Gagal',
              description: 'Confucius.ID',
              content: 'Gagal menambahkan tim baru'
            });
          }
        } catch (e) {
          console.log(e);
          if (e && e.message) {
            this.showToast({
              title: 'Terjadi kesalahan',
              description: 'Confucius.ID',
              content: e.message
            });
          }        
        }
      }
      else {
        this.resetNewTeam();
        this.showToast({
          title: 'Peringatan',
          description: 'Confucius.ID',
          content: 'Nama Tim tidak boleh lebih dari 15 karakter'
        });
      }
    },
    refreshBattle: function() {
      this.fetchBattle();
    },
    fetchBattle: async function() {
      this.battles = [];
      try {
        const results = await new BattleService().filter(
          null,
          [
            { by: 'id', type: 'asc' }
          ]
        );
        for (var i = 0; i < results.length; i++) {
          results[i].teams = await new BattleTeamService().filter(
            { battle_id: results[i].id }
          );
        }
        this.battles = results;
      } catch (e) {
        console.log(e);
      }
    },
    resetNewBattle: function() {
      this.newBattle = {
        name: '',
        type: 'A',
        teams: [],
      };
    },
    resetNewBattleTeams: function() {
      this.newBattle.teams = [];
    },
    fireAddBattle: async function() {
      if (this.newBattle.teams.length >= 2) {
        try {
          const results = await new BattleService().play(this.newBattle);
          if (results) {
            this.refreshBattle();
            this.resetNewBattle();
            this.showToast({
              title: 'Sukses',
              description: 'Confucius.ID',
              content: 'Berhasil menambahkan pertandingan baru'
            });
          }
          else {
            this.showToast({
              title: 'Gagal',
              description: 'Confucius.ID',
              content: 'Gagal menambahkan pertandingan baru'
            });
          }
        } catch (e) {
          console.log(e);
          if (e && e.message) {
            this.showToast({
              title: 'Terjadi kesalahan',
              description: 'Confucius.ID',
              content: e.message
            });
          }        
        }
      }
      else {
        this.showToast({
          title: 'Peringatan',
          description: 'Confucius.ID',
          content: 'Silahkan pilih dua atau lebih tim untuk bermain'
        });
      }
    },
    fireAddBattleScore: async function(battleId, battleTeamId, battleScoreElement, teamId, teamName) {
      var scoreElement = document.getElementById(battleScoreElement);
      var score = parseInt(scoreElement.value);
      if (confirm('Tambahkan ' + score + 'pt untuk tim: ' + teamName + '?')) {
        try {
          const results = await new BattleHistoryService().play({
            team_id: teamId,
            battle_id: battleId,
            battle_team_id: battleTeamId,
            score: score
          });
          console.log('results', results);
          if (results) {
            this.refreshBattle();
            this.refreshTeam();
            this.showToast({
              title: 'Sukses',
              description: 'Confucius.ID',
              content: 'Berhasil menambahkan skor'
            });
          }
          else {
            this.showToast({
              title: 'Gagal',
              description: 'Confucius.ID',
              content: 'Gagal menambahkan skor'
            });
          }
        } catch (e) {
          console.log(e);
          if (e && e.message) {
            this.showToast({
              title: 'Terjadi kesalahan',
              description: 'Confucius.ID',
              content: e.message
            });
          }        
        }
      }
    },
    showToast: function(data) {
      this.$refs.toast.setData(data).open();
    }
  },
  watch: {
    newBattleType: function(newVal, oldVal) {
      this.resetNewBattleTeams();
    }
  },
  computed: {
    newBattleType: function() {
      return this.newBattle.type;
    }
  }
});
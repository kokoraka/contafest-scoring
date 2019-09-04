import { connection } from "./services/connection.js";
import { TeamService } from "./services/team.js";

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
              name: 'teams',
              columns: {
                id: { primaryKey: true, autoIncrement: true },
                name: { notNull: true, dataType: "string" },
                type: { notNull: true, dataType: "string" },
                total_scores : { notNull: true, dataType: "number" },
                members: { dataType: 'array' },
                created_at: { notNull: true, dataType: 'date_time' },
                updated_at: { notNull: true, dataType: 'date_time' },
              }
            },
            {
              name: 'battles',
              columns: {
                id: { primaryKey: true, autoIncrement: true },
                name: { notNull: true, dataType: "string" },
                type: { notNull: true, dataType: "string" },
                total_scores : { notNull: true, dataType: "number" },
                teams: { dataType: 'array' },
                histories: { dataType: 'array' },
                created_at: { notNull: true, dataType: 'date_time' },
                updated_at: { notNull: true, dataType: 'date_time' },
              }
            }
          ]
        }
      },
    },
    newTeam: {
      name: '',
      type: '',
    },
    teams: [],
    teamsA: [],
    teamsB: [],
    battles: []
  },
  mounted: function() { 
    this.openConnection();
    this.setDatabaseContafest();

    this.refreshTeam();
    this.setDummyData();
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
    setDummyData: function() {
      // this.setDummyTeams();
      // this.multiplyDummyTeams(3);

      this.setDummyBattles();
      this.multiplyDummyBattles(3);
    },
    // setDummyTeams: function() {
    //   this.teams = [
    //     {
    //       id: 1,
    //       name: 'Pejuang45',
    //       type: 'A',
    //       total_scores: this.getRandomNumber(10000),
    //       members: [
    //         {name: 'Raka SW'},
    //         {name: 'Lucky CW'},
    //         {name: 'Yoga W'},
    //       ]
    //     },
    //     {
    //       id: 2,
    //       name: 'KidsZamanNow',
    //       type: 'A',
    //       total_scores: this.getRandomNumber(10000),
    //       members: [
    //         {name: 'Marchiella W'},
    //         {name: 'Wibisana T'},
    //         {name: 'Hokianto S'},
    //       ]
    //     },
    //     {
    //       id: 3,
    //       name: '3musketeer',
    //       type: 'B',
    //       total_scores: this.getRandomNumber(10000),
    //       members: [
    //         {name: 'Sianita D'},
    //         {name: 'Vania E'},
    //       ]
    //     },
    //     {
    //       id: 4,
    //       name: 'SingleTim',
    //       type: 'B',
    //       total_scores: this.getRandomNumber(10000),
    //       members: [
    //         {name: 'Evelyn J'},
    //       ]
    //     }
    //   ];
    // },
    // multiplyDummyTeams: function(amount = 1) {
    //   var teams = [];
    //   for (let i = 1; i <= amount; i++) {
    //     for (const team of this.teams) {
    //       teams.push(team);
    //     }
    //   }
    //   this.teams = teams;
    // },
    setDummyBattles: function() {
      this.battles = [
        {
          id: 1,
          name: 'Gantian',
          type: 'A',
          teams: [1, 3],
          total_scores: this.getRandomNumber(10000),
          histories: []
        },
        {
          id: 2,
          name: 'Rebutan',
          type: 'B',
          teams: [2, 3],
          total_scores: this.getRandomNumber(10000),
          histories: []
        },
        {
          id: 3,
          name: 'Babak Belur',
          type: 'A',
          teams: [3, 4],
          total_scores: this.getRandomNumber(10000),
          histories: []
        },
        {
          id: 4,
          name: 'Taruhan',
          type: 'B',
          teams: [2, 4],
          total_scores: this.getRandomNumber(10000),
          histories: []
        },
      ];
    },
    multiplyDummyBattles: function(amount = 1) {
      var battles = [];
      for (let i = 1; i <= amount; i++) {
        for (const team of this.battles) {
          battles.push(team);
        }
      }
      this.battles = battles;
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
      try {
        const results = await new TeamService().store(this.newTeam);
        if (results && results.length > 0) {
          this.refreshTeam();
          this.resetNewTeam();
          results.forEach(team => {
            alert('Berhasil menambahkan tim ' + team.name);
          });
        }
        else {
          alert('Gagal menambahkan tim');
        }
      } catch (e) {
        console.log(e);
        if (e && e.message) {
          alert(e.message);
        }        
      }
    }
  },
  watch: {
    // teams: function(newVal, oldVal) {
    //   console.log(newVal);
    //   console.log(oldVal);
    // }
  },
  computed: {

  }
});

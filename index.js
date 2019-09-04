new Vue({
  el: '#app',
  data: {
    connection: {},
    database: {
      contafest: {
        instance: {},
        status: false,
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
    teams: [],
    battles: []
  },
  mounted: function() { 
    this.openConnection();
    this.setDatabaseContafest();

    this.setDummyData();
  },
  methods: {
    openConnection: function() {
      this.connection = new JsStore.Instance();
    },
    setDatabaseContafest: async function() {
      this.database.contafest.status = await this.connection.initDb({
        name: this.database.contafest.setting.name,
        tables: this.database.contafest.setting.tables
      });
    },
    getRandomNumber: function(max) {
      return Math.floor(Math.random() * max);
    },
    setDummyData: function() {
      this.setDummyTeams();
      this.multiplyDummyTeams(3);

      this.setDummyBattles();
      this.multiplyDummyBattles(3);
    },
    setDummyTeams: function() {
      this.teams = [
        {
          id: 1,
          name: 'Pejuang45',
          type: 'A',
          total_scores: this.getRandomNumber(10000),
          members: [
            {name: 'Raka SW'},
            {name: 'Lucky CW'},
            {name: 'Yoga W'},
          ]
        },
        {
          id: 2,
          name: 'KidsZamanNow',
          type: 'A',
          total_scores: this.getRandomNumber(10000),
          members: [
            {name: 'Marchiella W'},
            {name: 'Wibisana T'},
            {name: 'Hokianto S'},
          ]
        },
        {
          id: 3,
          name: '3musketeer',
          type: 'B',
          total_scores: this.getRandomNumber(10000),
          members: [
            {name: 'Sianita D'},
            {name: 'Vania E'},
          ]
        },
        {
          id: 4,
          name: 'SingleTim',
          type: 'B',
          total_scores: this.getRandomNumber(10000),
          members: [
            {name: 'Evelyn J'},
          ]
        }
      ];
    },
    multiplyDummyTeams: function(amount = 1) {
      var teams = [];
      for (let i = 1; i <= amount; i++) {
        for (const team of this.teams) {
          teams.push(team);
        }
      }
      this.teams = teams;
    },
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

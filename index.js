new Vue({
  el: '#app',
  data: {
    database: {
      contafest: {
        object: null,
        setting: {
          name: 'contafest',
          version: 1
        }
      },
    },
    teams: [],
    battles: []
  },
  mounted: function() { 
    // var database = this.openDatabase();
    this.setDummyTeams();
    this.setDummyBattles();
  },
  methods: {
    openDatabase: function() {
      return idb.open(
        this.database.contafest.setting.name, 
        this.database.contafest.setting.version
      );
    },
    getRandomNumber: function(max) {
      return Math.floor(Math.random() * max);
    },
    setDummyTeams: function() {
      var defaultTeams = [
        {
          id: 1,
          name: 'Pejuang45',
          type: 'A',
          score: this.getRandomNumber(10000),
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
          score: this.getRandomNumber(10000),
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
          score: this.getRandomNumber(10000),
          members: [
            {name: 'Sianita D'},
            {name: 'Vania E'},
          ]
        },
        {
          id: 4,
          name: 'SingleTim',
          type: 'B',
          score: this.getRandomNumber(10000),
          members: [
            {name: 'Evelyn J'},
          ]
        }
      ];
      
      for (var i = 1; i <= 3; i++) {
        var curr = this;
        defaultTeams.forEach(function(team) {
          curr.teams.push(team);
        });
      }
    },
    setDummyBattles: function() {
      var defaultBattles = [
        {
          name: 'Gantian',
          teams: [1, 3]
        },
        {
          name: 'Rebutan',
          teams: [2, 3]
        },
        {
          name: 'Babak Belur',
          teams: [3, 4]
        },
        {
          name: 'Taruhan',
          teams: [2, 4]
        },
      ];
      
      for (var i = 1; i <= 3; i++) {
        var curr = this;
        defaultBattles.forEach(function(battle) {
          curr.battles.push(battle);
        });
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

window.$ = window.jQuery;

import { connection } from "./services/connection.js";
import { TeamService } from "./services/team.js";

Vue.component('toast', {
  template: `
  <div class="toast" role="alert" aria-live="assertive" 
    aria-atomic="true" data-autohide="false">
    <div class="toast" role="alert" data-delay="5000"
      style="position: absolute; top: 10px; right: 10px;">
      <div class="toast-header bg-dark text-white">
        <!-- <img src="" class="rounded mr-2" alt=""> -->
        <strong class="mr-auto">{{ toast.title }}</strong>
        <small class="text-white">{{ toast.description }}</small>
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
      $('#modalAddTeam').modal('hide');
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
            content: 'Gagal menambahkan tim ' + team.name
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
    },
    showToast: function(data) {
      this.$refs.toast.setData(data).open();
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
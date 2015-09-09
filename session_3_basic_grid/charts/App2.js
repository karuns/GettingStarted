
Ext.define('CustomApp2', {
    extend: 'Rally.app.App',      // The parent class manages the app 'lifecycle' and calls launch() when ready
    componentCls: 'app',          // CSS styles found in app.css

    // Entry Point to App
    launch: function() {

      console.log('our filter app');     // see console api: https://developers.google.com/chrome-developer-tools/docs/console-api
      //this._loadData();                 // we need to prefix with 'this.' so we call a method found at the app level.

      this.pulldownContainer  = Ext.create('Ext.container.Container', {
          layout: {
              type: 'hbox',
              align: 'stretch'
          },
          width: 400,
      });

      this.add(this.pulldownContainer);
      this._loadIterations();

    },

    // Get data from Rally

    _loadIterations: function () {
      this.iterComboBox = Ext.create('Rally.ui.combobox.IterationComboBox' , {
        fieldLabel:'Iterationss',
        labelAlign:'right',

        listeners: {
            ready: function(combobox) {
                this._loadSeverity();
            },
            select: function(combobox) {
            this._loadData();
            },
            scope: this
        }
      });
      this.pulldownContainer.add(this.iterComboBox);
    },

    _loadSeverity: function () {
        this.severityComboBox = Ext.create('Rally.ui.combobox.FieldValueComboBox' , {
            fieldLabel:'Severity',
            labelAlign:'right',

            model:'Defect',
            field:'Severity',
            listeners: {
                ready: function(combobox) {
                    this._loadData();
                },
                select: function(combobox) {
                    this._loadData();
                },
                scope: this
            }
        });
        this.pulldownContainer.add(this.severityComboBox);
    },



    _loadData: function() {
      var selectedIterationRef = this.iterComboBox.getRecord().get("_ref");
      var selectedSeverityValue = this.severityComboBox.getRecord().get('value');
      console.log("val=",selectedSeverityValue);

      var myFilter = [
            {
                property:'Iteration',
                operation:'=',
                value:selectedIterationRef
            },
            {
                property:'Severity',
                operation:'=',
                value: selectedSeverityValue
            }
        ]
    // if no defect store then creat
    if(this.myDefectStore) {
        this.myDefectStore.setFilter(myFilter);
        this.myDefectStore.load();
    }
    else {
        // set filter and load
        this.myDefectStore = Ext.create('Rally.data.wsapi.Store', {
            model: 'Defect',
            autoLoad: true,                         // <----- Don't forget to set this to true! heh
            filters: myFilter,
            listeners: {
                load: function (myStore, myData, success) {
                    console.log('got data!', myStore, myData)
                    if(!this.myGrid) {
                        this._createGrid(myStore);
                    }// if we did NOT pass scope:this below, this line would be incorrectly trying to call _createGrid() on the store which does not exist.
                },
                scope: this                         // This tells the wsapi data store to forward pass along the app-level context into ALL listener functions
            },
            fetch: ['FormattedID', 'Name', 'Severity', 'Iteration']   // Look in the WSAPI docs online to see all fields available!
        });
    }

    },


    _createGrid: function(myStoryStore) {

      this.myGrid = Ext.create('Rally.ui.grid.Grid', {
        store: myStoryStore,
        columnCfgs: [         // Columns to display; must be the same names specified in the fetch: above in the wsapi data store
          'FormattedID', 'Name', 'Severity', 'Iteration'
        ]
      });

      this.add(this.myGrid);       // add the grid Component to the app-level Container (by doing this.add, it uses the app container)
      console.log('what is this?', this);

    }

});

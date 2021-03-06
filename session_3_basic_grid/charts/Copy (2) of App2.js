
Ext.define('CustomApp2', {
    extend: 'Rally.app.App',      // The parent class manages the app 'lifecycle' and calls launch() when ready
    componentCls: 'app',          // CSS styles found in app.css
   
    // Entry Point to App
    launch: function() {
      console.log('QA rally charts');     // see console api: https://developers.google.com/chrome-developer-tools/docs/console-api
      
      /* Creating pull down container first and adding to app */
      this.pulldownContainer  = Ext.create('Ext.container.Container', {
          layout: {
              type: 'hbox',
              align: 'stretch'
          },
          width: 400,
      });
      
      this.add(this.pulldownContainer);
      this._loadChartList(); 
    },

    
    /* Loading list of availble chart */
    _loadChartList: function () {
    	var charts = Ext.create('Ext.data.Store', {
    		 fields: ['abbr', 'name'],
    		    data : [
    		        {"abbr":"BC", "name":"Burndown Chart"},
    		        {"abbr":"DT", "name":"Defect Trend"},  
    		        {"abbr":"PB", "name":"PI Burnup"},  
    		    ]
    	});
    	
    	this.chartTypes = Ext.create('Ext.form.ComboBox', {
    	    fieldLabel: 'Choose Chart',
    	    store: charts,
    	    queryMode: 'local',
    	    displayField: 'name',
    	    valueField: 'abbr',
    	    renderTo: Ext.getBody(),
    	    listeners: {
            ready: function(combobox) {
            	this._loadHighChart(this.chartTypes.getValue());
            },
            select: function(combobox) {
            	this._loadHighChart(this.chartTypes.getValue());
            },
            scope: this
        }
    	});
    	this.pulldownContainer.add(this.chartTypes);	
    },
    
    
    /* Load High charts */
    _loadHighChart : function(chartType) {
    	switch(chartType) {
    		case "BC": 
    			console.log("Loading Burndown chart ");
    			this._loadBurnDownChart();
    			break;
    		case "DT":
    			console.log("Loading Defect Trend ");
    			this._loadDefectTrend();
    			break;
    		case "PB":
    			console.log("Loading PI Burnup ");
    			this._loadPiBurnup();
    			break;
    		default:
    			console.log("Loading Burndown chart ");
    	}
    },
    
    //* Load individual charts *//
    
    /* Load burn down chart */
    _loadBurnDownChart : function() {
    	this.add({
            xtype: 'rallystandardreport',
            project: Rally.util.Ref.getRelativeUri(this.getContext().getProject()),
            projectScopeUp: this.getContext().getProjectScopeUp(),
            projectScopeDown: this.getContext().getProjectScopeDown(),
            width: 600,
            height: 400,
            reportConfig: {
                report: Rally.ui.report.StandardReport.Reports.Throughput,
                work_items: 'G,D',
                filter_field: 'ScheduleState'
            }
        });
    },
    
    /* Load Defect Trernd */
    _loadDefectTrend : function() {
    	var store = Ext.create('Ext.data.JsonStore', {
    	    fields: ['name', 'data1', 'data2', 'data3', 'data4', 'data5'],
    	    data: [
    	        { 'name': 'metric one',   'data1': 10, 'data2': 12, 'data3': 14, 'data4': 8,  'data5': 13 },
    	        { 'name': 'metric two',   'data1': 7,  'data2': 8,  'data3': 16, 'data4': 10, 'data5': 3  },
    	        { 'name': 'metric three', 'data1': 5,  'data2': 2,  'data3': 14, 'data4': 12, 'data5': 7  },
    	        { 'name': 'metric four',  'data1': 2,  'data2': 14, 'data3': 6,  'data4': 1,  'data5': 23 },
    	        { 'name': 'metric five',  'data1': 4,  'data2': 4,  'data3': 36, 'data4': 13, 'data5': 33 }
    	    ]
    	});

    	this.chart = Ext.create('Ext.chart.Chart', {
    	    renderTo: Ext.getBody(),
    	    width: 500,
    	    height: 300,
    	    animate: true,
    	    store: store,
    	    axes: [
    	        {
    	            type: 'Numeric',
    	            position: 'left',
    	            fields: ['data1', 'data2'],
    	            label: {
    	                renderer: Ext.util.Format.numberRenderer('0,0')
    	            },
    	            title: 'Sample Values',
    	            grid: true,
    	            minimum: 0
    	        },
    	        {
    	            type: 'Category',
    	            position: 'bottom',
    	            fields: ['name'],
    	            title: 'Sample Metrics'
    	        }
    	    ],
    	    series: [
    	        {
    	            type: 'line',
    	            highlight: {
    	                size: 7,
    	                radius: 7
    	            },
    	            axis: 'left',
    	            xField: 'name',
    	            yField: 'data1',
    	            markerConfig: {
    	                type: 'cross',
    	                size: 4,
    	                radius: 4,
    	                'stroke-width': 0
    	            }
    	        },
    	        {
    	            type: 'line',
    	            highlight: {
    	                size: 7,
    	                radius: 7
    	            },
    	            axis: 'left',
    	            fill: true,
    	            xField: 'name',
    	            yField: 'data2',
    	            markerConfig: {
    	                type: 'circle',
    	                size: 4,
    	                radius: 4,
    	                'stroke-width': 0
    	            }
    	        }
    	    ]
    	});
    	
    	this.add(this.chart);
    },
    
    
    /* Load PI burnup */
    _loadPiBurnup : function() {
    	 this.add({
             xtype: 'rallychart',
             loadMask: false,
             chartData: this._getChartData(),
             chartConfig: this._getChartConfig()
         });
    },
    
    _getChartData: function() {
        return {
            categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec'
            ],
            series: [
                {
                    name: 'Tokyo',
                    data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]

                },
                {
                    name: 'New York',
                    data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]

                },
                {
                    name: 'London',
                    data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]

                },
                {
                    name: 'Berlin',
                    data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]

                }
            ]
        };
    },

    /**
     * Generate a valid Highcharts configuration object to specify the column chart
     */
    _getChartConfig: function() {
        return {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Monthly Average Rainfall'
            },
            subtitle: {
                text: 'Source: WorldClimate.com'
            },
            xAxis: {
            },
            yAxis: {
                min: 0,
                    title: {
                    text: 'Rainfall (mm)'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                        borderWidth: 0
                }
            }
        };
    },




    
    
    
    
    
    
    
    
    
    ////   ---- OLD Stuff 

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

Ext.define("CookingTimes.view.Main", {
    extend: 'Ext.Panel',
    id: 'cookingtimes-main',
    requires: [
        'Ext.TitleBar',
        'Ext.Label',
        'Ext.slider.Slider',
        'Ext.carousel.Carousel',
        'Ext.SegmentedButton'
    ],
    config: {
        iconCls: 'home',
        layout:'vbox',
        styleHtmlContent: true,
        scrollable: false,

        items: [{
          docked: 'top',
          xtype: 'titlebar',
          title: 'Roaster'
        },{
            xtype:'carousel',
            itemId:'joint-selector',
            defaults:{
                xtype:'label',
                style: {
                    'font-size':'40px',
                    'font-weight': 'bold',
                    'text-align' : 'center'
                }
            },
            height:'100px',
            width:'100%',
            items:[{
                html:'Chicken',
                cooking:[20,45]
            },{
                html:'Lamb',
                cooking:{
                    'rare':[20,45],
                    'medium':[25,60],
                    'welldone':[30,75]
                }
            },{
                html:'Beef',
                joint:'beef',
                cooking:{
                    'rare':[20,45],
                    'medium':[25,60],
                    'welldone':[30,75]
                }                
            },{
                html:'Pork',
                cooking:[20,45]                       
            }],
            listeners:{
                'activeitemchange':function(self, newPanel) {
                    Ext.getCmp('cookingtimes-main').selectedJointChanged();
                }
            }
        },{
            xtype:'label',
            itemId: 'instructions-label',
            width:'80%',
            margin:'auto auto',
            style: {
                'text-align':'center'
            }          
        },{
            xtype:'panel',
            layout:'hbox',
            defaults:{
                xtype:'label',
                width:'50%',
                style: { 
                    'text-align'  : 'center',
                    'font-size'   : '40px',
                    'font-family' : "Consolas,'Lucida Console','DejaVu Sans Mono',monospace"
                }                
            },
            items:[
                {
                    itemId:'weight-label',
                    html:'x.xx'
                },{
                    itemId:'time',            
                    html:'0:00'
                },
            ]                
        },{
            // slider group
            xtype:'panel',            
            items:[{ 
                xtype:'slider',
                itemId:'weight-selector',
                minValue:0,
                maxValue:2500,
                increment:50,
                value:700, // 1.2kg
                listeners:{
                    drag:function(self, slider, newValue){                        
                        Ext.getCmp('cookingtimes-main').updateWeight(newValue[0] + 500);
                    },
                    change:function(self, slider,thumb, newValue){
                        Ext.getCmp('cookingtimes-main').updateWeight(newValue + 500);                        
                    }
                }
            }]
        },{
            xtype:'segmentedbutton',
            itemId:'finish-selector',
            defaults:{width:"33.3%",},
            width:'90%',
            minWidth:'300px',
            margin:'auto auto',
            items:[
                {text:'Rare', key:'rare'},
                {text:'Medium', key:'medium', pressed:true},
                {text:'Well done', key:'welldone'}
            ],
            listeners:{
                'toggle':function(){Ext.getCmp('cookingtimes-main').refresh();}
            }            
        }],
        listeners:{
            'activate':function(self){self.selectedJointChanged();}
        }
    },
    instructions:new Ext.Template('{timePerKilo} per kilo plus {initial} minutes at {temperature}&deg;C'),
    updateWeight:function(weight){
        var label = this.down('#weight-label');
        var weightInKilos = weight / 1000;
        var cookingTime = this.getSelectedCookingTime();
        label.setHtml( ( weightInKilos ).toFixed(2) );
        var minutes = cookingTime[0] + ( weightInKilos * cookingTime[1] ) + 5 ; // 20 + 45 per kilo etc
        
        var parts = this.toHoursAndMinutes(minutes);
        var hour = parts[0];
        var minute = parts[1];

        minute = Math.floor(minute / 5) * 5;
        
        minute = "" + minute ;
        if( minute.length == 1){ 
            minute = '0' + minute ;
        }        
        this.down('#time').setHtml(hour + ":" + minute);
    },
    getFinishSelector:function(){return this.down('#finish-selector');},
    getWeightSelector:function(){return this.down('#weight-selector');},
    toHoursAndMinutes:function(minutes){
        return [Math.floor(minutes / 60), minutes % 60 ];
    },
    refresh:function(){
        var cookingTime = this.getSelectedCookingTime();
        var minutesPerKilo = cookingTime[1];
        var parts = this.toHoursAndMinutes(minutesPerKilo);
        var formatted = '';
        if( parts[0] > 0 ){ 
            formatted += parts[0] + ' ' + (parts[0] == 1 ? 'hour' : 'hours') + ' ';
        }
        if( parts[1] > 0 ){
            formatted += parts[1] + ' minutes';
        }
        this.down('#instructions-label').setHtml(this.instructions.apply({
            initial:cookingTime[0],
            timePerKilo:formatted,
            temperature:"190"
        }));
        this.updateWeight(this.getWeightSelector().getValue()[0] + 500);
    },
    selectedJointChanged:function(){
        console.info("selectedJointChanged");
        var cookingtimes = this.getCurrentCookingTimes();
        if( Ext.isArray(cookingtimes) ){
            this.getFinishSelector().hide(true);
        } else {
            this.getFinishSelector().show(true);
        }
        this.refresh();
    },
    getSelectedCookingTime:function(){
        var times = this.getCurrentCookingTimes();
        if( Ext.isArray(times) ){
            return times;
        }
        return times[this.getFinishSelector().getPressedButtons()[0].key];
    },
    getCurrentCookingTimes:function(){
        var selected = this.down("#joint-selector").getActiveItem();
        return selected.cooking;
    }
});

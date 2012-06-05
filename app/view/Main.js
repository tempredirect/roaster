Ext.define("CookingTimes.view.Main", {
    extend: 'Ext.Panel',
    id: 'cookingtimes-main',
    requires: [
        'Ext.TitleBar',
        'Ext.Label',
        'Ext.slider.Slider',
        'Ext.carousel.Carousel'
    ],
    config: {
        iconCls: 'home',
        layout:'vbox',
        styleHtmlContent: true,
        scrollable: true,

        items: [{
          docked: 'top',
          xtype: 'titlebar',
          title: 'Roaster'
        },{
            xtype:'carousel',
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
                html:'Roast Chicken'
            },{
                html:'Roast Lamb'
            },{
                html:'Roast Beef'
            },{
                html:'Roast Pork'
            }]
        },{
            xtype:'label',
            width:'80%',
            margin:'auto auto',
            html:'45 minutes per kilo plus 20 minutes at 190&deg;C',
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
                minValue:0,
                maxValue:2500,
                increment:50,
                listeners:{
                    drag:function(self, slider, newValue){
                        Ext.getCmp('cookingtimes-main').updateWeight(newValue[0] + 500);
                    },
                    change:function(self, slider,thumb, newValue){
                        Ext.getCmp('cookingtimes-main').updateWeight(newValue + 500);                        
                    }
                }
            }]
        }]
    },
    updateWeight:function(weight){
        var label = this.down('#weight-label');
        var weightInKilos = weight / 1000;
        label.setHtml( ( weightInKilos ).toFixed(2) );
        var minutes = 20 + ( weightInKilos * 45 ) + 5 ; // 20 + 45 per kilo                
        
        var hour = Math.floor(minutes / 60);
        var minute = minutes % 60;

        minute = Math.floor(minute / 5) * 5;
        
        minute = "" + minute ;
        if( minute.length == 1){ 
            minute = '0' + minute ;
        }
        
        this.down('#time').setHtml(hour + ":" + minute);
    }
});

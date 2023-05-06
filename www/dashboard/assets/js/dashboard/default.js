// earning chart start
var options = {

    series: [
        {
          name: "Series 1",
          data: [
            [1327359600000, 6],
            [1327446000000,20],
            [1327532400000,15],
            [1327618800000,40],
            [1327878000000,18],
            [1327964400000,20],
            [1328050800000,18],
            [1328137200000,23],
            [1328223600000,18],
            [1328482800000,35],
            [1328569200000,30],
            [1328655600000,55],
            [1328742000000,0],
          ]
        }
    ],
    chart: {
        height: 145,
        type: 'area',
        toolbar: {
            show: false
        },
      
    },
   
    stroke: {
        curve: 'smooth',
        colors: [zetaAdminConfig.primary],
        lineCap: 'round',
        width: 3,
    },
    annotations: {
        points: [
          {
              x: new Date('31 January 2012').getTime(),
              y: 20 ,
            marker: {
              size: 6,
              fillColor: "#fff",
              strokeColor: zetaAdminConfig.primary,
              radius: 3,
              strokeWidth: 3,
            
            },
           
          }
        ]
      },
      colors: [zetaAdminConfig.primary],
    fill: {
        type: 'gradient',
        opacity: 0.1,
        gradient: {
            type: "vertical",
            opacityFrom: 0.65,
            opacityTo: 0.3,
            stops: [0,100]

        },
    },
    
    yaxis:{
        labels: {
           
            show: false,
        },
    },
    xaxis: {
        type: "datetime",
      
        show: false,
        labels: {
           
            show: false,
        },
        tooltip: {
            enabled: false
          },
        // categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan"],
        axisBorder: {
            show: false,
        },
        crosshairs: {
            show: false,
           
        },
    },
    legend: {
        show: false,
    },
    tooltip: {
        style: {
          fontSize: '12px',
        },
        x: {
            show: false,
        },
        y: {
            show: false,
        },
    },
    dataLabels: {
        enabled: false,
    },
    grid: {
        show: false,
        padding: {
            left: -10,
            right: 0,
            bottom: 0,
            top: -35
        }
    },
    responsive: [
        {
          breakpoint: 1600,
          options: {
            chart: {
                height: 105,
            }
          }
        }
      ]
};
var chart = new ApexCharts(document.querySelector("#earning-chart"), options);
chart.render();
// earning chart end



// weekly chart start
var options ={
    series: [
      {
        name:'Statistics',
        data:[500,600, 200, 700, 750, 500]
      },
      {
        name: 'Statistics',
        data: [800,800,800,800,800,800]
      }
    ],
    chart:{
      type:'bar',
      height:230,
      stacked:true,
      stackType: '100%',
      toolbar:{
        show:false,
      }
    }, 
    plotOptions: {
      bar:{       
        horizontal: false,
        columnWidth: '20px',
        borderRadius: 5,
      },
    }, 
    grid: {
      show:false,                  
      xaxis: {
        lines: {
          show: false
        }
      }
    },
    dataLabels:{
      enabled: false,
    },
    fill: {
      opacity: 1
    },
    legend: {
      show:false
    },    
    states: {          
      hover: {
        filter: {
          type: 'darken',
          value: 1,
        }
      }           
    },
    colors:[zetaAdminConfig.primary,'#f4f6fd'],
    yaxis: {
      tickAmount: 3,
      min: 0 ,
      max: 800 ,      
      
      axisBorder:{
       show:false,
     },
      axisTicks:{
        show: false,
      },
    },
    xaxis:{     
      categories:[
        'M','T','W','T','F','S'
      ],
      axisBorder:{
       show:false,
     },
    axisTicks:{
        show: false,
      },
    },
    states: {          
      hover: {
        filter: {
          type: 'darken',
          value: 1,
        }
      }           
    },    
    responsive: [
        {
          breakpoint: 1661,
          options:{
            chart: {
                height: 420,
            }
          }
        },
        {
          breakpoint: 1366,
          options:{
            chart: {
                height: 435,
            }
          }
        },
        {
          breakpoint: 1101,
          options:{
            chart: {
                height: 250,
            }
          }
        },
        {
          breakpoint: 1007,
          options:{
            chart: {
                height: 435,
            }
          }
        },
        {
          breakpoint: 992,
          options:{
            chart: {
                height: 385,
            }
          }
        },
        {
          breakpoint: 768,
          options:{
            chart:{
                height: 300,
            }
          }
        },{
          breakpoint: 576,
          options:{
            chart:{
                height: 250,
            }
          }
        }

      ]    
  };
  var chart = new ApexCharts(document.querySelector("#weekly-chart"), options);
  chart.render();
// weekly chart end


// transaction chart start
var options = {
    series: [{
        name: 'Males',
        data: [0, 20, 40, 60, 90, 70, 45, 30
        ]
    },
    {
        name: 'Females',
        data: [0,-20, -40, -60, -90, -70, -45, -30
        ]
    }
    ],
    chart: {
        toolbar:{
            show: false
        },
        type: 'bar',
        height: 155,
        stacked: true,
    },
    colors: [zetaAdminConfig.primary, zetaAdminConfig.secondary],
    plotOptions: {
        bar: {
            barHeight: '60px',
            horizontal: true,
            startingShape: 'rounded',
            endingShape: 'rounded',
        },
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        width: 1,
        borderRadius: 40,
        colors: ["transparent"]
    },

    grid: {
        borderColor: '#1e2f6533',
        xaxis: {
            lines: {
                show: true,
                Color: '#1e2f6533',
            }
        },
        yaxis: {
            lines: {
                show: false
            }
        },
        padding: {
            top:  -20,
            right: 0,
            bottom: -10,
            left: 0
        }, 
      
    },   
    yaxis: {
        show: false,
    },
    legend: {
        show: false,
    },
    tooltip: {           
        x: {
            formatter: function (val) {
                return val
            }
        },
        y: {
            formatter: function (val) {
                return Math.abs(val) + "%"
            }
        }
    },
    states:{          
      hover:{
        filter:{
          type: 'darken',
          value: 1,
        }
      }           
    },
    xaxis: {
        position: 'top',
        categories: ['85+', '80-84', '75-79', '70-74', '65-69', '60-64', '55-59'
        ],
        labels: {
            formatter: function (val) {
                return Math.abs(Math.round(val)) 
            },
            offsetX: 0,
            offsetY: 5,
            rotate: 0,
            style: {
                colors: ['#1e2f6533'],
                fontSize: '12px',
                fontWeight: 400,
            },
        },
        axisTicks: {
            show: false
        },
        axisBorder: {
            show: false
        },
    },

    // responsive: [
    //         {
    //           breakpoint: 1661,
    //           options: {
    //             chart: {
    //                 height:200,
    //             }
    //           }
    //         }
    //     ]
    
        
    };
var chart = new ApexCharts(document.querySelector("#transaction-chart"), options);
chart.render();
// transaction chart end



// yearly chart start
var options = {

    annotations: {
      points: [
        {
            x: new Date("14 Feb 2017").getTime(),
            y: 18  ,
            marker: {
            size: 8,
            fillColor: "#fff",
            strokeColor: zetaAdminConfig.primary,
            radius: 2,
          
          },
         
        }
      ]
    },
    
    chart: {
        toolbar: {
            show: false
        },
        dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 0,
            left: 4,
            blur: 4,
            color: zetaAdminConfig.primary,
            opacity: 0.14
        },
      height: 160,
      type: 'line',
          zoom: {
            enabled: false
          },
      
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
        width: 3,
        dashArray: 8,
        show: true,
        curve: 'smooth',
        lineCap: 'round',
      },
    yaxis: {
        show:false,
        axisTicks: {
            show: false
        },
        axisBorder: {
            show: false
        },
    },
    
    colors: [zetaAdminConfig.primary],
   series: [
    {
      name: "Series 1",
      data: [
        
        [1486771200000, 1], 
        [1486857600000, 12], 
        [1486944000000, 8], 
        [1487030400000, 20]
      ]
    }
  ],
    grid: {
        yaxis: {
            lines: {
                show: false
            }
        },
        yaxis: {
            lines: {
                show: false
            }
        },

        padding: {
            left: -20,
            right: 0,
            top: -30,
            bottom: 0
        }
    },
    xaxis: {
      type: "datetime",
       axisBorder: {
            show: false
        },
        axisTicks: {
            show: false
        },
        tooltip: {
            enabled: false
          },
          labels: {

            offsetX: -30,
            offsetY: 0,
          }
    },
    tooltip: {
        custom: function({ series, seriesIndex, dataPointIndex, w }) {
          return (
            '<div class="arrow_box">' +
            "<span>" +
            series[seriesIndex][dataPointIndex] +
            "</span>" +
            "</div>"
          );
        }
    },
    responsive: [
        {
          breakpoint: 992,
          options: {
            chart: {
                height: 120,
            }
          }
        }
      ]
  };
  
  var chart = new ApexCharts(document.querySelector("#yearly-chart"), options);
  
  chart.render();

  // yearly chart end 
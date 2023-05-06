


//sales  chart start
var options = {
  series: [
    {
      name: "Desktops",
      data: [18, 30, 25, 51, 34, 40, 34],
    },
  ],
  chart: {
    height: 142,
    type: "line",
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
    dropShadow: {
      enabled: true,
      bottom: 2,
      left: 10,
      blur: 6,
      color: '#000',
      opacity: 0.35
    },
  },
  colors: ["#fff"],
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
  },

  tooltip: {
    enabled: false,
  },

  grid: {
    yaxis: {
      lines: {
        show: false,
      },
    },
    padding: {
      left: -10,
      right: 0,
      bottom: -30,
      top: -30
    }
  },
  xaxis: {
    labels: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: false,
  },
};
var chart = new ApexCharts(
  document.querySelector("#sales-state-chart"),
  options
);
chart.render();
// sales chart end



//sales small  chart-1 start
new Chartist.Bar('.sales-small-1', {
  labels: ['M', 'T', 'W', 'T', 'F', 'S', 'M'],
  series: [
    [4, 9, 8, 10, 7, 12],
    [10, 5, 6, 4, 7, 2,]
  ]
},
  {
    stackBars: true,

    chartPadding: {
      top: -15,
      right: 0,
      bottom: -15,
      left: -35
    },
    axisX: {
      showGrid: false,
    },
    axisY: {
      low: 0,
      showGrid: false,
      labelInterpolationFnc: function (value) {
        return (value / 1);
      }
    }


  }).on('draw', function (data) {
    if (data.type === 'bar') {
      data.element.attr({
        style: 'stroke-width: 3px ; stroke-linecap: round'
      });
    }
  });

  //sales small  chart-1 end

//sales small  chart-2 start

new Chartist.Bar('.sales-small-2', {
  labels: ['M', 'T', 'W', 'T', 'F', 'S', 'M'],
  series: [
    [4, 9, 8, 10, 7, 12],
    [10, 5, 6, 4, 7, 2]
  ]
},
  {
    stackBars: true,

    chartPadding: {
      top: -15,
      right: 0,
      bottom: -15,
      left: -35
    },
    axisX: {
      showGrid: false,
    },
    axisY: {
      low: 0,
      showGrid: false,
      labelInterpolationFnc: function (value) {
        return (value / 1);
      }
    }


  }).on('draw', function (data) {
    if (data.type === 'bar') {
      data.element.attr({
        style: 'stroke-width: 3px ; stroke-linecap: round'
      });
    }
  });
//sales small  chart-2 end


  //sales small  chart-3 start
  new Chartist.Bar('.sales-small-3', {
    labels: ['M', 'T', 'W', 'T', 'F', 'S', 'M'],
    series: [
      [4, 9, 8, 10, 7, 12],
      [10, 5, 6, 4, 7, 2]
    ]
  },
  {
    stackBars: true,

    chartPadding: {
      top: -15,
      right: 0,
      bottom: -15,
      left: -35
    },
    axisX: {
      showGrid: false,
    },
    axisY: {
      low: 0,
      showGrid: false,
      labelInterpolationFnc: function (value) {
        return (value / 1);
      }
    }
  }).on('draw', function (data) {
    if (data.type === 'bar') {
      data.element.attr({
        style: 'stroke-width: 3px ; stroke-linecap: round'
      });
    }
  });
  //sales small  chart-3 end


// invoice-overviwe-chart start
var options = {
  series: [{
    name: 'Revenue',   
    data: [19, 28, 31, 25, 35, 18, 23]
  }, {
    name: 'Free Cash Flow',   
    data: [25, 31, 35, 29, 39, 22, 28]
  }],
  chart: {
    type: 'bar',
    height: 263,
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '20%',
      endingShape: 'rounded'
    },
  },
  dataLabels: {
    enabled: false
  },
  legend: {
    show: false,
  },
  colors: [zetaAdminConfig.primary, zetaAdminConfig.secondary],
  stroke: {
    show: true,
    width: 1,
    colors: ['transparent']
  },
  states: {          
      hover: {
        filter: {
          type: 'darken',
          value: 1,
        }
      }           
    },
  xaxis: {
    categories: [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    labels: {
      offsetX:  0,
      offsetY: -6,
      style: {
        colors: "#8E97B2",
        fontWeight: 400,
        fontSize: '10px',
        fontFamily: 'roboto'
      },
    },
    axisBorder: {
      show: false,

    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {   
    labels:{
      offsetX: 14,
      offsetY: -5   
    },
    tooltip: {
      enabled: true
    },
    labels: {
      formatter: function (value) {
        return value + "k";
      },
    },
  },
  fill: {
    opacity: 1
  }, 
  tooltip: {
    y: {
      formatter: function (val) {
        return "$ " + val + " thousands"
      }
    }
  },
  states: {          
      hover: {
        filter: {
          type: 'darken',
          value: 1,
        }
      }           
  },
};

var chart = new ApexCharts(document.querySelector("#invoice-overviwe-chart"), options);
chart.render();

// invoice overviwe chart end

// special discount start
  $('.discount-slide').owlCarousel({
    loop: true,
    margin: 10,    
    dots: true,
    items:1,
    nav :false ,
  })
// special discount end


//sales-state chart start
var options = {
  series: [
    {
      name: "Desktops",
      data: [25, 12, 9, 16, 10, 21, 55, 104, 64 , 70, 25 ],
    },
  ],
  chart: {
    height: 95,
    type: "line",
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
    dropShadow: {
      enabled: true,
      top: 0,
      left: 6,
      blur: 4,
      color: '#6362e7',
      opacity: 0.20
    },
  },
  colors: [zetaAdminConfig.primary],
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
    lineCap: "butt"
  },

  tooltip: {
    enabled: false,
  },

  grid: {
    yaxis: {
      lines: {
        show: false,
      },
    },
    padding: {
      left: -10,
      right: 0,
      bottom: 0,
      top: -30
    }
  },
  xaxis: {
    labels: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: false,
  },
   responsive: [
    {
      breakpoint: 421,
      options: {
        chart: {
            height:60,
        }
      }
    },           
  ], 
};

var chart = new ApexCharts(
  document.querySelector("#total-sales-chart"),
  options
);
chart.render();

//sales-state chart end


// revenue chart start
  var options = {
      labels: ['Men', 'Women', 'Accessories','Children','Apperal'],
      series: [44, 55, 41, 17, 15],
      chart: {
        type: 'donut',
        height: 320 ,
      },
      legend:{
        position:'bottom'
      },
      dataLabels: {
        enabled: false,
      },      
      states: {          
        hover: {
          filter: {
            type: 'darken',
            value: 1,
          }
        }           
      },
      stroke: {
        width: 0,
      },
      responsive: [
            {
              breakpoint: 1661,
              options: {
                chart: {
                    height:310,
                }
              }
            },            
            {
              breakpoint: 481,
              options:{
                chart:{
                    height:280,
                }
              }
            }

        ],     
      colors:[zetaAdminConfig.primary,zetaAdminConfig.secondary,zetaAdminConfig.success,zetaAdminConfig.info,zetaAdminConfig.warning],
  };
  var chart = new ApexCharts(document.querySelector("#revenue-chart"), options);
  chart.render();
// revenue chart end


// discount timer start
function makeTimer() {
  var endTime = new Date("19 January 2022 20:00:00 GMT+5:30");      
  endTime = (Date.parse(endTime) / 1000);
  var now = new Date();
  now = (Date.parse(now) / 1000);
  var timeLeft = endTime - now;
  var days = Math.floor(timeLeft / 86400); 
  var hours = Math.floor((timeLeft - (days * 86400)) / 3600);
  var minutes = Math.floor((timeLeft - (days * 86400) - (hours * 3600 )) / 60);
  var seconds = Math.floor((timeLeft - (days * 86400) - (hours * 3600) - (minutes * 60)));
  if (days < "10") { days = "0" + days; }
  if (hours < "10") { hours = "0" + hours; }
  if (minutes < "10") { minutes = "0" + minutes; }
  if (seconds < "10") { seconds = "0" + seconds; }
  $(".days").html(days);
  $(".hours").html(hours);
  $(".minutes").html(minutes);
  $(".seconds").html(seconds);    
}

setInterval(function() { makeTimer(); }, 1000);
// discount timer end
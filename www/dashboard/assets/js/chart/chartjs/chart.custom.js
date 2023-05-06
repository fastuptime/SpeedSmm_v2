///////////////////// myBarGraph /////////////////////

var ctx = document.getElementById('myBarGraph');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: 'Employee',
            backgroundColor: zetaAdminConfig.primary,
            data: [10, 40, 5, 38, 27, 12, 29, 17, 40],
        }, {
            label: 'Engineer',
            backgroundColor: zetaAdminConfig.secondary,
            data: [-15, -20, -5, -40, -24, -12, 25, -15, -23],
        }, {
            label: 'Government',
            backgroundColor: zetaAdminConfig.success,
            data: [16, 25, 5, 31, 30, 12, 19, 19, 27],
        }, {
            label: 'Political parties',
            backgroundColor: zetaAdminConfig.info,
            data: [-10, -15, -5, -33, -26, -12, -26, -12, -34],
        }]
    },
    options: {
        scales: {

            x: {
            },

            y: {
                beginAtZero: true,
            }
        }
    }
});


///////////////////// myGraph /////////////////////

var ctx = document.getElementById('myGraph');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: 'Employee',
            backgroundColor: zetaAdminConfig.primary,
            data: [20,  -10, 5, -38, 27, -12, 29, -17, 40],
          
            borderColor: zetaAdminConfig.primary,
            tension: 0.5
        }, {
            label: 'Government',
            backgroundColor: zetaAdminConfig.secondary,
            data: [16, 25, -20, 31, 30, 12, 19, 19, 27],
            borderColor: zetaAdminConfig.secondary,
            tension: 0.5

        },
        {
            label: 'Political parties',
            backgroundColor: zetaAdminConfig.info,
            data: [26, 35, 15, 21, 15, 22, 19, 10, 27],
            borderColor: zetaAdminConfig.info,
        

        },

        ]
    },
    options: {

    }
});



///////////////////// myRadarGraph /////////////////////


var ctx = document.getElementById('myRadarGraph');

var myChart = new Chart(ctx, {
    type: 'radar',
    data: {
        labels: ['Eating','Drinking','Sleeping','Designing','Coding','Cycling','Running'],
        datasets: [{
            label: 'My First Dataset',
            data: [65, 59, 70, 79, 56, 55, 40],
            fill: true,
            backgroundColor: 'rgba(99, 98, 231, 0.2)',
            borderColor: zetaAdminConfig.primary,
            pointBackgroundColor: zetaAdminConfig.primary,
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: zetaAdminConfig.primary
          }, {
            label: 'My Second Dataset',
            data: [28, 48, 40, 19, 76, 27, 80],
            fill: true,
            backgroundColor: 'rgba(255, 197, 0, 0.2)',
            borderColor: zetaAdminConfig.secondary,
            pointBackgroundColor:zetaAdminConfig.secondary,
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: zetaAdminConfig.secondary
          }]    
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        elements: {
            line: {
                borderWidth: 2
            }
        }
    }
});


///////////////////// mypolarareaChart /////////////////////

var ctx = document.getElementById('mypolarareaChart');
var myChart = new Chart(ctx, {
    type: 'polarArea',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple'],
        datasets: [{
            label: 'My First Dataset',
            data: [11, 16, 7, 3, 14],
            backgroundColor: [
                zetaAdminConfig.primary,
              zetaAdminConfig.secondary,
              zetaAdminConfig.success,
              zetaAdminConfig.light_1,
              zetaAdminConfig.warning   
            ]
          }]
    
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
    }
});

///////////////////// myDoughnutGraph /////////////////////

	
// var ctx = document.getElementById('myDoughnutGraph');
// var myChart = new Chart(ctx, {
// 		type: 'doughnut',
// 		data: {
// 			labels: ['Red', 'Blue', 'Yellow', 'Green'],
// 			datasets: [{
// 				data: [300, 50, 100, 150,250],
// 				backgroundColor: ["#62C1C1","#92C348", "#EC6362", "#B4B4B5", "#BFE5E5" ],
// 				hoverBackgroundColor: [ "#62C1C1", "#92C348", "#EC6362", "#B4B4B5", "#BFE5E5" ],
// 				borderWidth: 0,
// 				borderColor: ["#62C1C1","#92C348", "#EC6362", "#B4B4B5","#BFE5E5" ],
// 				hoverBorderWidth: 2,
// 			}]
// 		},
// 		options: {
// 			responsive: true,
// 			legend: {
// 				position: 'bottom',
// 				reverse: false,
// 				labels: {
// 					padding: 25,
// 					fontSize: 12,
// 					fontColor: 'rgb(0, 0, 0)'
// 				}
// 			},
// 			tooltips: {
// 				enabled: true,
// 			},
// 			cutoutPercentage: 70,
// 			rotation: -0.5 * Math.PI,
// 			circumference: 2 * Math.PI,
// 			title: {
// 				display: true,
// 				text: 'Chart.js Doughnut Chart'
// 			},
// 			animation: {
// 				animateScale: true,
// 				animateRotate: true
// 			},
		
// 		}
//     });

var ctx = document.getElementById('myDoughnutGraph');
var myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: [
            'Red','Blue','Yellow','Green', 'Purple'],
        datasets: [{
            label: 'My First Dataset',
            data: [300, 50, 100, 250,150],
            backgroundColor: [
                zetaAdminConfig.primary,
              zetaAdminConfig.danger,
              zetaAdminConfig.success,
              zetaAdminConfig.warning,
              zetaAdminConfig.secondary   
            ]
          }]
    
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        pluginS:{
            legend: {
                position: 'bottom'
            }
        }
    }
});


///////////////////// mypolarareaChart /////////////////////

var ctx = document.getElementById('mymixchart');
var mixedChart  = new Chart(ctx, {
    type: 'scatter',
    data: {
        datasets: [{
            type: 'bar',
            label: 'Bar Chart Dataset',
            data: [10, 20, 30, 40, 50, 60, 70, 80, 90],
            backgroundColor: [
                zetaAdminConfig.primary,
              zetaAdminConfig.secondary,
              zetaAdminConfig.info,
              zetaAdminConfig.success,
              zetaAdminConfig.warning,
              zetaAdminConfig.danger   
            ]
        }, {
            type: 'line',
            label: 'Line Chart Dataset',
            data: [ 20, 30, 40, 50, 60, 70, 80, 90,100],
            borderColor: zetaAdminConfig.primary,
            pointBackgroundColor: [zetaAdminConfig.primary],
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: zetaAdminConfig.primary
        }],
        labels: ['January', 'February', 'March', 'April', 'May' , 'June', 'July' , 'August', 'September']
    
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
    }
});
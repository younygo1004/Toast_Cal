// 교수용 페이지 버튼과 이벤트리스너
var calProBtn = document.getElementById("calProBtn");
var subProBtn = document.getElementById("subProBtn");
var voteProBtn = document.getElementById("voteProBtn");
var shareProBtn = document.getElementById("shareProBtn");

calProBtn.addEventListener('click', function(event) {
    changeContents('calendar-common', 'professor1', 'professor2', 'professor3');
    changeContents('sidebar');
});

subProBtn.addEventListener('click', function(event) {
    changeContents('professor1', 'calendar-common', 'professor2', 'sidebar', 'professor3');
});

voteProBtn.addEventListener('click', function(event) {
    changeContents('professor2', 'calendar-common', 'professor1', 'sidebar', 'professor3');
});

shareProBtn.addEventListener('click', function(event) {
    changeContents('professor3', 'professor2', 'calendar-common', 'sidebar', 'professor1');
});

// 교수 투표 페이지 관련 select, button DOM
var voteClass = document.getElementById('lecture-class');
var voteStatus = document.getElementById('vote-status');
var voteTableBtn = document.getElementById('voteTableBtn');

// 서버에서 filter를 적용할 투표 페이지 관련 데이터 object
var voteData = {
    lecture_type: "일반 교양",
    vote_status: "투표중"
}
ajaxPost("/toast_cal/voteTable/", 'json', "POST", voteData).then(function(data) {
        $('#vote-info').empty();

        for (var count = 0; count < data.length; count++) {
            var tr = $("<tr><td>" + data[count].fields.code + "</td>" +
                "<td>" + data[count].fields.lecture_type + "</td>" + "<td>" + data[count].fields.name + "</td>" +
                "<td>" + data[count].fields.vote_status + "</td>" + "<td><button type=\"button\" class=\"voteBtn\">상세</button></td>");
            $('#vote-info').append(tr);
        }

    })
    .catch(function(err) {
        console.log(err);
    })

voteTableBtn.addEventListener('click', function(event) {
    voteData.lecture_type = voteClass.value;
    voteData.vote_status = voteStatus.value;

    // console.log(voteData);
    ajaxPost("/toast_cal/voteTable/", 'json', "POST", voteData).then(function(data) {
            $('#vote-info').empty();

            for (var count = 0; count < data.length; count++) {
                var tr = $("<tr><td>" + data[count].fields.code + "</td>" +
                    "<td>" + data[count].fields.lecture_type + "</td>" + "<td>" + data[count].fields.name + "</td>" +
                    "<td>" + data[count].fields.vote_status + "</td>" + "<td><button type=\"button\" class=\"voteBtn\">상세</button></td>");
                $('#vote-info').append(tr);
            }

        })
        .catch(function(err) {
            console.log(err);
        })
});

// chart 표시하기 위한 데이터
var chart = null;

$(document).on("click", ".voteBtn", function() {

    if (chart != null) chart.destroy();
    var voteBtn = $(this);

    var tr = voteBtn.parent().parent();
    var td = tr.children();

    var chartData = {
        code: td.eq(0).text()
    }

    ajaxPost("/toast_cal/voteChart/", 'json', "POST", chartData).then(function(data) {
            // console.log(data.length);
            // console.log(data);
            if (data.length > 0) {
                //toast UI Chart 세팅
                var doughnut = document.getElementById('chart-area');
                var doughnutData = {
                    categories: ['투표 현황'],
                    series: [{
                            name: '찬성',
                            data: data[0].fields.agree_votes
                        },
                        {
                            name: '반대',
                            data: data[0].fields.reject_votes
                        },
                        {
                            name: '투표안함',
                            data: data[0].fields.all_students - data[0].fields.agree_votes - data[0].fields.reject_votes
                        }
                    ]
                };

                var theme = {
                    series: {
                        colors: [
                            '#87CE00', '#FF4848', '#BDBDBD'
                        ],
                        label: {
                            color: '#000000',
                            fontFamily: 'sans-serif'
                        }
                    }
                };

                tui.chart.registerTheme('myTheme', theme);


                var doughnutOption = {
                    chart: {
                        width: 400,
                        height: 250,
                        title: data[0].fields.name + '(' + data[0].fields.code + ') 시험 투표',
                        format: function(value, chartType, areaType, valuetype, legendName) {
                            if (areaType === 'makingSeriesLabel') {
                                value = value;
                            }

                            return value;
                        }
                    },
                    series: {
                        radiusRange: ['60%', '100%'],
                        showLabel: true,
                        showLegend: true,
                        allowSelect: true,
                        startAngle: true,
                        endAngle: false,
                        labelAlign: 'center'
                    },
                    legend: {
                        align: 'right'
                    },
                    theme: 'myTheme'
                };


                chart = tui.chart.pieChart(doughnut, doughnutData, doughnutOption);
            }

        })
        .catch(function(err) {
            console.log(err);
        });

});

var lecMakeBtn = document.getElementById("lecMakeBtn");

lecMakeBtn.addEventListener('click', async function(event) {
    let makeData = {
        name: document.getElementById("lec-name").value,
        code: document.getElementById("lec-code").value,
        codeClass: document.getElementById("lec-class").value,
        period: document.getElementById("lec-time").value,
        lecture_type: document.getElementById("lec-type").value,
        department: document.getElementById("lec-depart").value,
    };
    document.getElementById("make-lecture-wrap").reset();
    let scheduleData;

    await ajaxPost("/toast_cal/makeSubject/", "json", "POST", makeData)
        .then(function(data) {

            var timeData = periodSplit(data[0].fields.period);
            var convData = periodConvert(timeData);
            var calData = [];
            // console.log(convData);
            for (var i = 0; i < 15; i++) {
                var dateArr = getTimeData(convData, i * 7);
                // console.log(dateArr);
                for (var j = 0; j < 2; j++) {
                    var calobj = {};
                    // console.log(dateArr[j].startDate);
                    // console.log(dateArr[j].endDate);
                    calobj = newCalObj(1, data[0].fields.lecture_type,
                        data[0].fields.name, "time", "미정", dateArr[j].startDate,
                        dateArr[j].endDate, convertBooleanData(false),
                        "busy", "public");
                    calData.push(calobj);
                }

            }
            // console.log(calData);
            scheduleData = calData;
        })
        .catch(function(err) {
            alert(err);
        });

    console.log(scheduleData);
    scheduleData = {
        scheduleData
    };

    await ajaxPost("/toast_cal/makeCalendars/", "json", "POST", scheduleData)
        .then(function(data) {
            alert(data);

        })
        .catch(function(err) {
            alert(err);
        });

    calendar.clear();

    ajaxPost("/toast_cal/ourstores/", 'json', "POST", "1")
        .then(function(data) {
            create(calendar, data);
        })
        .catch(function(err) {
            alert(err);
        });
});
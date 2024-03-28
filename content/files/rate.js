// @author Alan Harder
var crumb = { wrap: function() { } };

function loaddata() {
  var script = document.createElement('SCRIPT');
  script.type = 'text/javascript';
  script.src = 'https://rating.jenkins.io/rate/result.php';
  script.onload = function() { do_loaddata(); }
  script.onreadystatechange = function() { // For IE
    if (this.readyState=='loaded' || this.readyState=='complete') do_loaddata();
  }
  document.getElementById('head').appendChild(script);
  return false;
}

function health(nm, cls, ver, rate, desc, rating) {
  return `<button class="app-button app-button--tertiary ${cls}" data-tooltip="${desc}" onclick="rate('${ver}',${rate})">
            <span>${rating}</span>
            <img src="/images/changelog/${nm}.svg" alt="${desc}" />
          </button>`;
}

function do_loaddata() {
  var r, v, j = true, div1, div2, txt;
  for (var anchors = document.getElementsByTagName('H3'), i = 0; i < anchors.length; i++) {
    if (anchors[i].id.charAt(0) != 'v') continue;
    r = data[v = anchors[i].id.substring(1)];
    const owner = document.createElement('div');
    owner.className = 'ownerpapi'
    div2 = document.createElement('DIV');
    div2.className = 'rate-offset';
    txt = health('sunny',(r && r[0] ? '' : 'light'),v,1, 'No major issues with this release', (r && r[0] ? r[0] + ' ' : '0 '))
        + health('cloudy',(r && r[1] ? '' : 'light'),v,0, 'I experienced notable issues', (r && r[1] ? r[1] + ' ' : '0 '))
        + health('storm',(r && r[2] ? '' : 'light'),v,-1, 'I had to roll back', (r && r[2] ? r[2] + ' ' : '0 '));
    div2.innerHTML = txt;

    txt = ''
    const div3 = document.createElement('DIV');
    if (r && r.length > 3) {
      txt += '<span class="related-issues">Community reported issues: ';
      var issues = [];
      for (j = 3; j < r.length; j += 2) {issues.push({id: r[j], count: r[j + 1]})}
      issues.sort(function (a, b) {return b.count - a.count;});
      for (j = 0; j < issues.length; j++)
        txt += issues[j].count + '&times;<a href="https://issues.jenkins.io/browse/JENKINS-' + issues[j].id + '">JENKINS-' + issues[j].id + '</a> ';
      txt += '</span>';
    } else {
      txt += `<span class="related-issues">   </span>`
    }
    div3.innerHTML = txt;
    owner.appendChild(div2);
    owner.appendChild(div3);
    anchors[i].parentNode.parentNode.appendChild(owner);
  }
}

function rate(version,rating) {
  var issue = (rating <= 0) ? prompt('Please provide issue number from our JIRA causing trouble:','') : '';
  if (issue==null) return; // Cancelled
  if (rating <= 0 && issue == '') {
    issue = prompt('Are you sure you do not want to provide an issue reference? It really helps us improve Jenkins.\nEnter issue number, or leave empty to skip:', '');
    if (issue==null) return; // Cancelled
  }
  var script = document.createElement('SCRIPT');
  script.type = 'text/javascript';
  script.src = 'https://rating.jenkins.io/rate/submit.php?version='
    + encodeURIComponent(version) + '&rating=' + rating + '&issue=' + encodeURIComponent(issue);
  script.onload = function() { alert('Thanks!'); location.reload(); }
  script.onreadystatechange = function() { // For IE
    if (this.readyState=='loaded' || this.readyState=='complete') {
      alert('Thanks!'); location.reload();
    }
  }
  document.getElementById('head').appendChild(script);
}


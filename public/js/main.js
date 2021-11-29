// fetch ally issues
const testA11y = async (e) => {
  'use strict';

  e.preventDefault();

  const url = document.querySelector('#url').value;
  const includeNotices = document.querySelector('#includeNotice').checked;
  const includeWarnings = document.querySelector('#includeWarning').checked;
  if (url === '') {
    alert('Please enter a valid url');
  } else {
    setLoading();

    const response = await fetch(`/api/test?url=${url}&notice=${includeNotices}&warn=${includeWarnings}`);

    if (response.status !== 200) {
      setLoading(false);
      alert('failed');
    } else {
      var { issues } = await response.json();
      addIssuesToDom(issues);
    }

    setLoading(false);
  }
};

// add issues to dom
const addIssuesToDom = (issues) => {
  'use strict';

  const output = document.querySelector('#issues');
  const includeNotices = document.querySelector('#includeNotice').checked;
  const includeWarnings = document.querySelector('#includeWarning').checked;
  let issueCount = 0;

  output.innerHTML = '';

  if (issues.length === 0) {
    output.innerHTML = '<h4>🥳 No issues found! 🥳</h4>';
  } else {
    issues.forEach((issue) => {
      if (!includeNotices && issue.type === 'notice') {
        return;
      }
      if (!includeWarnings && issue.type === 'warning') {
        return;
      }
      issueCount++;
      let icon = '';
      let txtClass = '';
      if (issue.type === 'notice') {
        icon = '💡';
        txtClass = 'info';
      }
      if (issue.type === 'warning') {
        icon = '⚠️';
        txtClass = 'warning';
      }
      if (issue.type === 'error') {
        icon = '🎯';
        txtClass = 'danger';
      }
      const div = `
        <div class="card mb-5">
          <div class="card-body">
            <h4 class='text-${txtClass}'>${icon} ${issue.message}</h4>
            <pre class='bg-light p-3 my-3 code'>${escapehtml(issue.context)}</pre>
            <p class='bg-secondary text-light'>
            CODE: ${issue.code}
            </p>
          </div>
        </div>
      `;
      output.innerHTML += div;
    });
    if (issueCount === 0) {
      output.innerHTML = '<h4>🥳 No issues found! 🥳</h4>';
    } else {
      const issueDom = output.innerHTML;
      output.innerHTML = `<h4>${issueCount} issues found!</h4>` + issueDom;
    }
    var event = new Event('issues-updated');
    document.dispatchEvent(event);
  }
};

// set loading state
const setLoading = (isLoading = true) => {
  const loader = document.querySelector('.loader');
  loader.style.display = isLoading ? 'block' : 'none';
};

// escape html
const escapehtml = (html) => {
  'use strict';
  if (html && html !== null && html !== '') {
    return html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
  return '';
};

document.querySelector('#form').addEventListener('submit', testA11y);
document.addEventListener('issues-updated', () => {
  document.querySelectorAll('pre.code').forEach((el) => {
    hljs.highlightElement(el);
  });
});

// fetch ally issues
const testA11y = async (e) => {
  e.preventDefault();

  const url = document.querySelector('#url').value;
  if (url === '') {
    alert('Please enter a valid url');
  } else {
    setLoading();

    const response = await fetch(`/api/test?url=${url}`);

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
  const output = document.querySelector('#issues');
  output.innerHTML = '';

  if (issues.length === 0) {
    output.innerHTML = '<h4>🥳 No issues found! 🥳</h4>';
  } else {
    issues.forEach((issue) => {
      const div = `
        <div class="card mb-5">
          <div class="card-body">
            <h4>⚠️ ${issue.message}</h4>
            <p class='bg-light p-3 my-3'>
              ${escapehtml(issue.context)}
            </p>
            <p class='bg-secondary text-light'>
            CODE: ${issue.code}
            </p>
          </div>
        </div>
      `;
      output.innerHTML += div;
    });
  }
};

// set loading state
const setLoading = (isLoading = true) => {
  const loader = document.querySelector('.loader');
  loader.style.display = isLoading ? 'block' : 'none';
};

// escape html
const escapehtml = (html) => {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

document.querySelector('#form').addEventListener('submit', testA11y);

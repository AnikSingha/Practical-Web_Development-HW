function addRow() {
  const table = document.getElementById('gpaTable').getElementsByTagName('tbody')[0];
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td>
      <select>
        <option value="">Select Grade</option>
        <option value="A+">A+</option>
        <option value="A">A</option>
        <option value="A-">A-</option>
        <option value="B+">B+</option>
        <option value="B">B</option>
        <option value="B-">B-</option>
        <option value="C+">C+</option>
        <option value="C">C</option>
        <option value="C-">C-</option>
        <option value="D+">D+</option>
        <option value="D">D</option>
        <option value="D-">D-</option>
        <option value="F">F</option>
      </select>
    </td>
    <td><input type="text" placeholder="Credits" /></td>
    <td><button onclick="deleteRow(this)">X</button></td>
  `;
  table.appendChild(newRow);
}

function deleteRow(btn) {
  const row = btn.parentElement.parentElement;
  row.remove();
  calculateGPA();
}

function calculateGPA() {
  const gradePoints = {
    'A+': 4.3,
    'A': 4.0, 
    'A-': 3.7,
    'B+': 3.3, 
    'B': 3.0, 
    'B-': 2.7,
    'C+': 2.3, 
    'C': 2.0, 
    'C-': 1.7,
    'D+': 1.3, 
    'D': 1.0, 
    'D-': 0.7,
    'F': 0.0
  };

  const rows = document.querySelectorAll('#gpaTable tbody tr');
  let totalCredits = 0;
  let weightedSum = 0;

  rows.forEach(row => {
    const gradeSelect = row.querySelector('select').value;
    const credits = row.querySelector('input[type="text"]').value;

    if (gradeSelect && credits && !isNaN(credits)) {
      const creditVal = parseFloat(credits);
      totalCredits += creditVal;
      weightedSum += gradePoints[gradeSelect] * creditVal;
    }
  });

  const gpa = totalCredits ? (weightedSum / totalCredits).toFixed(2) : 0;
  document.getElementById('gpaResult').textContent = `GPA: ${gpa}`;
}

function resetTable() {
  const table = document.getElementById('gpaTable').getElementsByTagName('tbody')[0];
  table.innerHTML = `
    <tr>
      <td>
        <select>
          <option value="">Select Grade</option>
          <option value="A+">A+</option>
          <option value="A">A</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B">B</option>
          <option value="B-">B-</option>
          <option value="C+">C+</option>
          <option value="C">C</option>
          <option value="C-">C-</option>
          <option value="D+">D+</option>
          <option value="D">D</option>
          <option value="D-">D-</option>
          <option value="F">F</option>
        </select>
      </td>
      <td><input type="text" placeholder="Credits" /></td>
      <td><button onclick="deleteRow(this)">X</button></td>
    </tr>
  `;
  document.getElementById('gpaResult').textContent = 'GPA: 0.00';
}

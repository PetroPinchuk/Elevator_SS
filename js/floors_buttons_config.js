let floorsCount = localStorage.getItem('floorsCount');

if (floorsCount !== null) {
  document.querySelector('#floorsCountInput').value = floorsCount;
}

document.querySelector('#generateFloors').addEventListener('click', function() {
  floorsCount = document.querySelector('#floorsCountInput').value;
  if (floorsCount < 5 || floorsCount > 10) {
    alert('Для найкращого візуального враження, будь ласка, введіть кількість поверхів у діапазоні від 5 до 10. Дякую за увагу до деталей!');
    floorsInLocalStorage = 5;
    return;
  } 
  localStorage.setItem('floorsCount', floorsCount);
  floorsCount = '';
  location.reload();
});

const configFloors = {
  floorsCount : floorsCount,
}

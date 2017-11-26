document.getElementById('back-top').onclick = function() {
  scrollTo(document.body, 0, 100);
}
function scrollTo(element, to, duration) {
  if (duration < 0) return;
  var difference = to - element.scrollTop;
  var perTick = difference / duration * 2;
  setTimeout(function() {
    element.scrollTop = element.scrollTop + perTick;
    scrollTo(element, to, duration - 2);
  }, 5);
}

function showMenu() {
  var showMenuContent = document.getElementById('sub-menu');
  var closeBtn = document.getElementById('show-menu');
  showMenuContent.classList.toggle('active');
  closeBtn.classList.toggle('close-btn');
}

function deleteFavorite() {
  var deleteBtn = document.getElementsByClassName('delete-favorite');
  var parentDelete = deleteBtn.parentElement;
  parentDelete.classList.add('hidden');
}

function showReview() {
  var showReviewTable = document.getElementById('show-review');
  showReviewTable.classList.add('active');
}

function showFilterSpecialist() {
  let filterContent = document.getElementById("filter-content");
  filterContent.classList.add("active");
}

function closeFilterSpecialist() {
  let closefilterContent = document.getElementById("filter-content");
  closefilterContent.classList.remove("active");
}

function showNotification() {
  let showNotificationContent = document.getElementById("list-notification");
  showNotificationContent.classList.toggle("active");
}

function showDetailProfile() {
  let showDetailProfileContent = document.getElementById("profileDetail");
  showDetailProfileContent.classList.toggle("show");
}
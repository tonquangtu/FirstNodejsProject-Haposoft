document.getElementById('back-top').onclick = function () {
  scrollTo(document.body, 0, 100);
}

function scrollTo(element, to, duration) {
  if (duration < 0) return;
  let difference = to - element.scrollTop;
  let perTick = difference / duration * 2;
  setTimeout(function () {
    element.scrollTop = element.scrollTop + perTick;
    scrollTo(element, to, duration - 2);
  }, 5);
}

function showMenu() {
  let showMenuContent = document.getElementById('sub-menu');
  let closeBtn = document.getElementById('show-menu');
  showMenuContent.classList.toggle('active');
  closeBtn.classList.toggle('close-btn');
}

function deleteFavorite() {
  let deleteBtn = document.getElementsByClassName('delete-favorite');
  let parentDelete = deleteBtn.parentElement;
  parentDelete.classList.add('hidden');
}

function showReview() {
  let showReviewTable = document.getElementById('show-review');
  showReviewTable.classList.add('active');
}

function showFilterSpecialist() {
  let filterContent = document.getElementById("filter-content");
  filterContent.classList.add("active");
}

function closeFilterSpecialist() {
  let closeFilterContent = document.getElementById("filter-content");
  closeFilterContent.classList.remove("active");
}

function showNotification() {
  let showNotificationContent = document.getElementById("list-notification");
  if (showNotificationContent)
    showNotificationContent.classList.toggle("active");
}

function showDetailProfile() {
  let showDetailProfileContent = document.getElementById("profileDetail");
  let changeIcon = document.getElementById("showProfile");
  showDetailProfileContent.classList.toggle("show");
  changeIcon.classList.toggle("change-icon");
}

function confirmDeletePopup() {
  let confirmDeleteContent = document.getElementById("confirm-delete");
  confirmDeleteContent.classList.add("active");
}

function showOptionTicket() {
  let optionTicketContent = document.getElementById("option-buy-ticket");
  optionTicketContent.classList.add("active");
}

function closeOptionTicket() {
  let optionTicketContent = document.getElementById("option-buy-ticket");
  optionTicketContent.classList.remove("active");
}

function showInputSearch() {
  let inputSearchHeader = document.getElementById("input-search-header");
  inputSearchHeader.classList.toggle("active");
}


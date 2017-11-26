export const custom = {
  methods: {
    scrollTo(element, to, duration) {
      if (duration < 0) return;
      let difference = to - element.scrollTop;
      let perTick = difference / duration * 2;
      setTimeout(() => {
          element.scrollTop = element.scrollTop + perTick;
          scrollTo(element, to, duration - 2);
        }, 5)
      ;
    },
    showMenu() {
      let showMenuContent = window.$('#sub-menu');
      let closeBtn = window.$('#show-menu');
      showMenuContent.toggleClass('active');
      closeBtn.toggleClass('close-btn');
    },

    deleteFavorite() {
      let deleteBtn = window.$('.delete-favorite');
      let parentDelete = deleteBtn.parentElement;
      parentDelete.addClass('hidden');
    },

    showReview() {
      let showReviewTable = window.$('#show-review');
      showReviewTable.addClass('active');
    },

    showFilterSpecialist() {
      let filterContent = window.$("#filter-content");
      filterContent.addClass("active");
    },

    closeFilterSpecialist() {
      let closeFilterContent = window.$("#filter-content");
      closeFilterContent.removeClass("active");
    },

    showNotification() {
      let showNotificationContent = window.$("#list-notification");
      showNotificationContent.toggleClass("active");
    },

    showDetailProfile() {
      let showDetailProfileContent = window.$("#profileDetail");
      showDetailProfileContent.toggleClass("show");
    },

    confirmDeletePopup() {
      let confirmDeleteContent = window.$("#confirm-delete");
      confirmDeleteContent.addClass("active");
    },

    showOptionTicket() {
      let optionTicketContent = window.$("#option-buy-ticket");
      optionTicketContent.addClass("active");
    },

    closeOptionTicket() {
      let optionTicketContent = window.$("#option-buy-ticket");
      optionTicketContent.removeClass("active");
    },

    showInputSearch() {
      let inputSearchHeader = window.$("#input-search-header");
      inputSearchHeader.toggleClass("active");
    },

    showHamburgerMenu() {
      let hamburgerMenuContent = window.$("#hamburger-menu-content");
      hamburgerMenuContent.toggleClass("active");
    },
  },
  mounted() {
    window.$('body').on('click', '#back-top', function () {
      let body = $("html, body");
      body.stop().animate({scrollTop:0});
    });
  }
};


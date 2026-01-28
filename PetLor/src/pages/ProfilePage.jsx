import React from "react";

const ProfilePage = () => {
  return (
    <div className="bg-gray-50 min-h-screen mt-16">
      {/* Header Section */}
      <section className="relative overflow-hidden pt-12 pb-24 bg-teal-600">
        <div className="absolute inset-0 opacity-10">
          <svg
            className="h-full w-full"
            fill="none"
            viewBox="0 0 400 400"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="200" cy="200" r="100" stroke="white" strokeWidth="2" />
            <circle cx="350" cy="50" r="50" stroke="white" strokeWidth="2" />
            <circle cx="50" cy="350" r="80" stroke="white" strokeWidth="2" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Hồ sơ cá nhân
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 mb-20 relative z-20">
        <div className="bg-white rounded-xl p-8 md:p-12 shadow-xl">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Left Column: Avatar & Socials */}
            <div className="w-full lg:w-1/3 flex flex-col items-center">
              <div className="relative group">
                <div className="relative p-1.5 rounded-full border-2 border-dashed border-emerald-600/30 group-hover:border-emerald-600 transition-colors">
                  <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-xl">
                    <img
                      alt="Profile Photo"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBh5Ebb9RT5mHA_DCn6fMyCMrW1qz17Su5yfFQzX6s3EmdobnrNzJ7DESM7VL3ZXoAW-A5gLAsBIHhqgVs6cgMjAVN-X45Ym9-Ikh6qlCJqfWqVtyQ2aTZPobULp8mKEn6utHaDGYFERx8lbKLmmDt3bPwJmB3wbfKqah0MoUugsykzHgw3D_bdcmbuRQxzgbjiY2ws8kjhnnUt3RFMrJa4KBxPeyqvNmlgYNQU_gn5mwRC3RiaX_z1FxWu7FhdCd4EdzI22YCr8Wc"
                    />
                  </div>
                </div>
                <button className="absolute bottom-2 right-2 bg-emerald-600 text-white p-3.5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center border-4 border-white">
                  <span className="material-symbols-outlined text-lg">
                    edit_square
                  </span>
                </button>
              </div>

              <div className="text-center mt-6">
                <h2 className="text-2xl font-extrabold text-gray-900">
                  Vũ Anh Dương
                </h2>
              </div>

              <div className="mt-12 w-full">
                <h3 className="text-sm font-extrabold text-gray-400 mb-6 uppercase tracking-wider flex items-center gap-2">
                  <span className="h-px bg-gray-200 flex-grow"></span>
                  Liên kết mạng xã hội
                  <span className="h-px bg-gray-200 flex-grow"></span>
                </h3>
                <div className="space-y-4">
                  {/* GitHub Link */}
                  <a
                    className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-emerald-600/40 hover:bg-white transition-all group"
                    href="#"
                  >
                    <div className="w-11 h-11 flex items-center justify-center bg-gray-900 text-white rounded-xl shadow-lg">
                      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
                      </svg>
                    </div>
                    <div className="flex-grow">
                      <div className="text-sm font-bold text-gray-900">
                        GitHub
                      </div>
                      <div className="text-xs text-gray-500">
                        github.com/Vuanhduong25102004
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-gray-400 group-hover:text-emerald-600 transition-colors text-xl">
                      <a href="https://github.com/Vuanhduong25102004">
                        north_east
                      </a>
                    </span>
                  </a>

                  {/* Facebook Link */}
                  <a
                    className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-emerald-600/40 hover:bg-white transition-all group"
                    href="#"
                  >
                    <div className="w-11 h-11 flex items-center justify-center bg-blue-600 text-white rounded-xl shadow-lg">
                      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                      </svg>
                    </div>
                    <div className="flex-grow">
                      <div className="text-sm font-bold text-gray-900">
                        Facebook
                      </div>
                      <div className="text-xs text-gray-500">
                        facebook.com/Sonabu2/
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-gray-400 group-hover:text-emerald-600 transition-colors text-xl">
                      <a href="https://www.facebook.com/Sonabu2/">north_east</a>
                    </span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Personal Info */}
            <div className="w-full lg:w-2/3">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-1.5 h-8 bg-emerald-600 rounded-full"></div>
                <h3 className="text-xl font-extrabold text-gray-900">
                  Thông tin cá nhân
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                {/* Field: Họ tên */}
                <div className="space-y-2.5">
                  <label className="text-sm font-extrabold text-gray-500 flex items-center gap-2 ml-1 uppercase tracking-wider">
                    <span className="material-symbols-outlined text-emerald-600 text-lg">
                      badge
                    </span>
                    Họ và tên
                  </label>
                  <input
                    className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-xl focus:ring-2 focus:ring-emerald-600 focus:bg-white outline-none font-semibold text-gray-900"
                    readOnly
                    type="text"
                    defaultValue="Vũ Anh Dương"
                  />
                </div>

                {/* Field: Email */}
                <div className="space-y-2.5">
                  <label className="text-sm font-extrabold text-gray-500 flex items-center gap-2 ml-1 uppercase tracking-wider">
                    <span className="material-symbols-outlined text-emerald-600 text-lg">
                      alternate_email
                    </span>
                    Địa chỉ Email
                  </label>
                  <input
                    className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-xl focus:ring-2 focus:ring-emerald-600 focus:bg-white outline-none font-semibold text-gray-900"
                    readOnly
                    type="email"
                    defaultValue="vuanhduong251020042@gmail.com"
                  />
                </div>

                {/* Field: SĐT */}
                <div className="space-y-2.5">
                  <label className="text-sm font-extrabold text-gray-500 flex items-center gap-2 ml-1 uppercase tracking-wider">
                    <span className="material-symbols-outlined text-emerald-600 text-lg">
                      phone_android
                    </span>
                    Số điện thoại
                  </label>
                  <input
                    className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-xl focus:ring-2 focus:ring-emerald-600 focus:bg-white outline-none font-semibold text-gray-900"
                    readOnly
                    type="text"
                    defaultValue="097 247 1680"
                  />
                </div>

                {/* Field: Trường */}
                <div className="space-y-2.5">
                  <label className="text-sm font-extrabold text-gray-500 flex items-center gap-2 ml-1 uppercase tracking-wider">
                    <span className="material-symbols-outlined text-emerald-600 text-lg">
                      account_balance
                    </span>
                    Trường học
                  </label>
                  <input
                    className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-xl focus:ring-2 focus:ring-emerald-600 focus:bg-white outline-none font-semibold text-gray-900"
                    readOnly
                    type="text"
                    defaultValue="Đại học Nguyễn Trãi"
                  />
                </div>

                {/* Field: Ngành */}
                <div className="space-y-2.5">
                  <label className="text-sm font-extrabold text-gray-500 flex items-center gap-2 ml-1 uppercase tracking-wider">
                    <span className="material-symbols-outlined text-emerald-600 text-lg">
                      school
                    </span>
                    Chuyên ngành
                  </label>
                  <input
                    className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-xl focus:ring-2 focus:ring-emerald-600 focus:bg-white outline-none font-semibold text-gray-900"
                    readOnly
                    type="text"
                    defaultValue="Công nghệ thông tin"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;

<template>
  <!-- SideBar component -->
  <!-- animate__animated animate__slideInLeft -->
  <!-- WHEN SHOW MENU -->
  <div
    data-aos="fade-right"
    data-aos-duration="700"
    data-aos-easing="ease-in-out"
    class="flex bg-linear-to-b from-blue-900 via-violet-700 to-violet-400 text-white h-screen flex-col shadow-xl/20 rounded-r-2xl fixed w-60 p-4"
  >
    <div class="logo flex items-center justify-between shrink-0">
      <img
        src="@/assets/CTU_logo.png"
        width="75"
        class="shrink-0 m-auto"
        alt=""
      />
      <!-- <h1 class="font-bold text-2xl pl-4 flex gap-2">
        <span class="text-pink-500">A</span>
        <span class="text-blue-500">I</span>
        <span class="text-amber-600">I</span>
        <span class="text-green-500">L</span>
        <span class="text-yellow-500">O</span>
        <span class="text-red-500">O</span>
      </h1> -->
      <!-- <img src="\logo.svg" alt="" width="100" /> -->
      <!-- <h1 class="flex items-center gap-2 text-2xl font-bold">AiiLoo</h1> -->
    </div>

    <div class="menu flex flex-col gap-4 mt-10 px-2">
      <!-- Menu items go here -->

      <!-- DASHBOARD -->
      <div>
        <router-link
          :to="{ name: 'admin.dashboard' }"
          class="cursor-pointer items-center flex gap-2 px-4 py-1 rounded hover:bg-blue-600 w-full"
          type="button"
          href=""
        >
          <span>
            <font-awesome-icon
              icon="fa-regular fa-house"
              style="color: #ffffff"
          /></span>

          <span class="text-sm">Dashbroad</span>
        </router-link>
      </div>

      <!-- USERS -->
      <div>
        <router-link
          :to="{ name: 'admin.users' }"
          class="cursor-pointer items-center flex gap-2 px-4 py-1 rounded hover:bg-blue-600 w-full"
          type="button"
          href=""
        >
          <span>
            <font-awesome-icon icon="fa-solid fa-user" style="color: #ffffff"
          /></span>

          <span class="text-sm">Users</span>
        </router-link>
      </div>

      <!-- ROLES -->
      <div>
        <router-link
          :to="{ name: 'admin.roles' }"
          class="cursor-pointer items-center flex gap-2 px-4 py-1 rounded hover:bg-blue-600 w-full"
          type="button"
          href=""
        >
          <span>
            <font-awesome-icon
              icon="fa-solid fa-microchip"
              style="color: #ffffff"
          /></span>

          <span class="text-sm">Roles</span>
        </router-link>
      </div>

      <!-- PORTS -->
      <div>
        <router-link
          :to="{ name: 'admin.ports' }"
          class="cursor-pointer items-center flex gap-2 px-4 py-1 rounded hover:bg-blue-600 w-full"
          type="button"
          href=""
        >
          <span>
            <font-awesome-icon icon="fa-solid fa-anchor" style="color: #ffffff"
          /></span>

          <span class="text-sm">Ports</span>
        </router-link>
      </div>

      <!-- SHIPS -->
      <div>
        <router-link
          :to="{ name: 'admin.ships' }"
          class="cursor-pointer items-center flex gap-2 px-4 py-1 rounded hover:bg-blue-600 w-full"
          type="button"
          href=""
        >
          <span>
            <font-awesome-icon icon="fa-solid fa-ship" style="color: #ffffff"
          /></span>

          <span class="text-sm">Ships</span>
        </router-link>
      </div>

      <!-- SCHEDULES -->
      <div>
        <router-link
          :to="{ name: 'admin.schedules' }"
          class="cursor-pointer items-center flex gap-2 px-4 py-1 rounded hover:bg-blue-600 w-full"
          type="button"
          href=""
        >
          <span>
            <font-awesome-icon
              icon="fa-solid fa-chart-simple"
              style="color: #ffffff"
          /></span>

          <span class="text-sm">Schedules</span>
        </router-link>
      </div>
    </div>

    <div class="flex flex-col flex-end justify-between mt-auto">
      <hr class="border-t border-white opacity-20 mb-4" />

      <div class="flex ml-2 items-center gap-3">
        <div>
          <button class="cursor-pointer" type="button">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3Z0HTxQx4CdM8YXA6tZ3_8-ktfoWxwstczw&s"
              alt=""
              class="w-10 h-10 rounded-full object-cover"
            />
          </button>
        </div>
        <div class="ml-3">
          <p class="font-semibold text-sm">Le Thanh Nam</p>
          <p class="text-sm text-gray-300">Admin</p>

          <a class="underline text-sm" href="/home">Logout</a>
        </div>
      </div>

      <!-- SETTINGS -->
      <div class="flex mt-4">
        <button
          class="cursor-pointer bg-linear-to-tr from-blue-900 via-violet-700 to-violet-400 flex gap-2 px-4 py-2 rounded-2xl hover:bg-linear-to-br w-full mt-auto"
          type="button"
          href=""
        >
          <span>
            <font-awesome-icon icon="fa-solid fa-wrench" style="color: #ffffff"
          /></span>

          <span>Settings</span>
        </button>
      </div>
    </div>
  </div>
</template>

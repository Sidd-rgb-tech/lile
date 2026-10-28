package com.change360.app.ui.navigation

sealed class Screen(val route: String, val title: String, val icon: String) {
    object Home : Screen("home", "Home", "home")
    object Assistant : Screen("assistant", "AI Assistant", "psychology")
    object Challenges : Screen("challenges", "Challenges", "task_alt")
    object Impact : Screen("impact", "My Impact", "bar_chart")
    object Poster : Screen("poster", "Create Poster", "palette")
    object Campaigns : Screen("campaigns", "Campaigns", "campaign")
    object Stories : Screen("stories", "Impact Stories", "auto_stories")
    object ProfileSettings : Screen("profile_settings", "Profile & Settings", "person")
}

val BottomNavItems = listOf(
    Screen.Home,
    Screen.Assistant,
    Screen.Challenges,
    Screen.Impact,
    Screen.Poster
)

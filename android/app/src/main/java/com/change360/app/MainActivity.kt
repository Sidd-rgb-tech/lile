package com.change360.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.change360.app.ui.navigation.BottomNavItems
import com.change360.app.ui.navigation.Screen
import com.change360.app.ui.screens.*
import com.change360.app.ui.theme.Change360Theme
import com.change360.app.viewmodel.Change360ViewModel
import com.change360.app.viewmodel.Change360ViewModelFactory

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val app = application as Change360Application
        val viewModel: Change360ViewModel by viewModels {
            Change360ViewModelFactory(app.repository)
        }

        setContent {
            Change360Theme {
                val uiState by viewModel.uiState.collectAsState()
                
                // Track app startup stages: SPLASH -> LOGIN -> MAIN_APP
                var authStage by remember { mutableStateOf(StartupStage.SPLASH) }

                val navController = rememberNavController()
                val navBackStackEntry by navController.currentBackStackEntryAsState()
                val currentRoute = navBackStackEntry?.destination?.route ?: Screen.Home.route

                when (authStage) {
                    StartupStage.SPLASH -> {
                        GeminiSplashIntroScreen(
                            onAnimationFinished = {
                                // Transition from splash to the Google login screen
                                authStage = StartupStage.LOGIN
                            }
                        )
                    }
                    StartupStage.LOGIN -> {
                        LoginScreen(
                            onLoginSuccess = { name, email ->
                                // Automatically mark onboarding complete and jump straight to main app
                                val currentProfile = uiState.userProfile
                                val updatedProfile = currentProfile.copy(
                                    name = name,
                                    isOnboardingCompleted = true
                                )
                                viewModel.updateUserProfile(updatedProfile)
                                authStage = StartupStage.MAIN_APP
                            }
                        )
                    }
                    StartupStage.MAIN_APP -> {
                        // Preserving your exact original onboarding check & full scaffold setup
                        if (!uiState.userProfile.isOnboardingCompleted) {
                            OnboardingScreen(
                                currentProfile = uiState.userProfile,
                                onCompleteOnboarding = { updatedProfile ->
                                    viewModel.updateUserProfile(updatedProfile)
                                }
                            )
                        } else {
                            Scaffold(
                                modifier = Modifier.fillMaxSize(),
                                bottomBar = {
                                    NavigationBar {
                                        BottomNavItems.forEach { screen ->
                                            NavigationBarItem(
                                                selected = currentRoute == screen.route,
                                                onClick = {
                                                    navController.navigate(screen.route) {
                                                        popUpTo(navController.graph.startDestinationId) {
                                                            saveState = true
                                                        }
                                                        launchSingleTop = true
                                                        restoreState = true
                                                    }
                                                },
                                                icon = {
                                                    Icon(
                                                        imageVector = when (screen.route) {
                                                            "home" -> Icons.Default.Home
                                                            "assistant" -> Icons.Default.Psychology
                                                            "challenges" -> Icons.Default.TaskAlt
                                                            "impact" -> Icons.Default.BarChart
                                                            "poster" -> Icons.Default.Palette
                                                            else -> Icons.Default.Star
                                                        },
                                                        contentDescription = screen.title
                                                    )
                                                },
                                                label = { Text(screen.title) }
                                            )
                                        }
                                    }
                                }
                            ) { innerPadding ->
                                NavHost(
                                    navController = navController,
                                    startDestination = Screen.Home.route,
                                    modifier = Modifier.padding(innerPadding)
                                ) {
                                    composable(Screen.Home.route) {
                                        HomeScreen(
                                            viewModel = viewModel,
                                            onNavigateToAssistant = { navController.navigate(Screen.Assistant.route) },
                                            onNavigateToChallenges = { navController.navigate(Screen.Challenges.route) },
                                            onNavigateToImpact = { navController.navigate(Screen.Impact.route) },
                                            onNavigateToPoster = { navController.navigate(Screen.Poster.route) },
                                            onNavigateToCampaigns = { navController.navigate(Screen.Campaigns.route) },
                                            onNavigateToProfile = { navController.navigate(Screen.ProfileSettings.route) }
                                        )
                                    }
                                    composable(Screen.Assistant.route) {
                                        AIAssistantScreen(viewModel = viewModel)
                                    }
                                    composable(Screen.Challenges.route) {
                                        ChallengesScreen(viewModel = viewModel)
                                    }
                                    composable(Screen.Impact.route) {
                                        MyImpactScreen(viewModel = viewModel)
                                    }
                                    composable(Screen.Poster.route) {
                                        PosterGeneratorScreen(viewModel = viewModel)
                                    }
                                    composable(Screen.Campaigns.route) {
                                        CampaignsScreen(
                                            onNavigateToPoster = { navController.navigate(Screen.Poster.route) }
                                        )
                                    }
                                    composable(Screen.Stories.route) {
                                        ImpactStoriesScreen(
                                            onOpenChallenge = { navController.navigate(Screen.Challenges.route) }
                                        )
                                    }
                                    composable(Screen.ProfileSettings.route) {
                                        ProfileSettingsScreen(viewModel = viewModel)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

enum class StartupStage {
    SPLASH,
    LOGIN,
    MAIN_APP
}
package com.change360.app.ui.screens

import androidx.compose.animation.*
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.change360.app.data.model.AwarenessCategory
import com.change360.app.data.model.UserProfile
import com.change360.app.ui.theme.*

@Composable
fun OnboardingScreen(
    currentProfile: UserProfile,
    onCompleteOnboarding: (UserProfile) -> Unit
) {
    var step by remember { mutableStateOf(0) } // 0: Welcome/Auth, 1: Causes, 2: Target, 3: Vibe
    var isGoogleUser by remember { mutableStateOf(false) }
    var displayName by remember { mutableStateOf(currentProfile.displayName) }
    var selectedCauses by remember { mutableStateOf(currentProfile.selectedCauses.toSet()) }
    var targetMinutes by remember { mutableStateOf(currentProfile.dailyTargetMinutes) }
    var selectedVibe by remember { mutableStateOf(currentProfile.preferredPosterVibe) }

    val bgBrush = Brush.verticalGradient(
        colors = listOf(
            Color(0xFFFFFFFF),
            Color(0xFFE8FDF3),
            Color(0xFFFFE8E9)
        )
    )

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(bgBrush)
            .padding(20.dp)
    ) {
        when (step) {
            0 -> {
                // Welcome & Google Sign-In Screen
                Column(
                    modifier = Modifier.fillMaxSize(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    // Logo Icon with Vibrant Ring
                    Box(
                        modifier = Modifier
                            .size(96.dp)
                            .clip(CircleShape)
                            .background(
                                Brush.linearGradient(
                                    listOf(DeepTeal, NeonMint, ElectricCoral)
                                )
                            )
                            .padding(4.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Surface(
                            modifier = Modifier.fillMaxSize(),
                            shape = CircleShape,
                            color = Color.White
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Text(
                                    text = "360°",
                                    fontSize = 28.sp,
                                    fontWeight = FontWeight.Black,
                                    color = DeepTeal
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(24.dp))

                    Text(
                        text = "CHANGE360",
                        fontSize = 32.sp,
                        fontWeight = FontWeight.Black,
                        color = TextPrimary,
                        letterSpacing = (-0.5).sp
                    )

                    Text(
                        text = "Learn. Act. Track. Inspire.",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = DeepTeal,
                        modifier = Modifier.padding(top = 4.dp)
                    )

                    Text(
                        text = "Turn awareness into vibrant daily impact across 20 social causes.",
                        fontSize = 13.sp,
                        color = TextSecondary,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.padding(horizontal = 24.dp, vertical = 12.dp)
                    )

                    Spacer(modifier = Modifier.height(36.dp))

                    // Continue with Google Button (Official Material 3 styling)
                    OutlinedButton(
                        onClick = {
                            isGoogleUser = true
                            displayName = "Alex Morgan"
                            step = 1
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(52.dp),
                        shape = RoundedCornerShape(16.dp),
                        border = ButtonDefaults.outlinedButtonBorder.copy(width = 1.5.dp),
                        colors = ButtonDefaults.outlinedButtonColors(
                            containerColor = Color.White,
                            contentColor = TextPrimary
                        )
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.Center
                        ) {
                            Text(
                                text = "G",
                                fontSize = 20.sp,
                                fontWeight = FontWeight.Black,
                                color = ElectricCoral,
                                modifier = Modifier.padding(end = 12.dp)
                            )
                            Text(
                                text = "Continue with Google",
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    // Guest / Demo Mode Link
                    TextButton(
                        onClick = {
                            isGoogleUser = false
                            displayName = "Changemaker (Guest)"
                            step = 1
                        }
                    ) {
                        Text(
                            text = "Skip for Now (Explore in Guest Mode)",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = TextSecondary
                        )
                    }
                }
            }

            1 -> {
                // Step 1: Select Your Causes
                Column(modifier = Modifier.fillMaxSize()) {
                    Text(
                        text = "Step 1 of 3",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = DeepTeal
                    )
                    Text(
                        text = "What causes ignite your passion?",
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary
                    )
                    Text(
                        text = "Select 2 or more causes to personalize your challenges and daily impact.",
                        fontSize = 13.sp,
                        color = TextSecondary,
                        modifier = Modifier.padding(top = 4.dp, bottom = 16.dp)
                    )

                    LazyVerticalGrid(
                        columns = GridCells.Fixed(2),
                        modifier = Modifier.weight(1f),
                        horizontalArrangement = Arrangement.spacedBy(10.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        items(AwarenessCategory.entries) { category ->
                            val isSelected = selectedCauses.contains(category.displayName)
                            Card(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable {
                                        selectedCauses = if (isSelected) {
                                            selectedCauses - category.displayName
                                        } else {
                                            selectedCauses + category.displayName
                                        }
                                    },
                                shape = RoundedCornerShape(16.dp),
                                colors = CardDefaults.cardColors(
                                    containerColor = if (isSelected) DeepTealContainer else Color.White
                                ),
                                border = if (isSelected) ButtonDefaults.outlinedButtonBorder.copy(width = 2.dp, brush = Brush.linearGradient(listOf(DeepTeal, NeonMint))) else null
                            ) {
                                Row(
                                    modifier = Modifier.padding(12.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Icon(
                                        imageVector = if (isSelected) Icons.Default.CheckCircle else Icons.Default.AddCircleOutline,
                                        contentDescription = null,
                                        tint = if (isSelected) DeepTeal else TextMuted,
                                        modifier = Modifier.size(18.dp)
                                    )
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text(
                                        text = category.displayName,
                                        fontSize = 11.sp,
                                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                        color = if (isSelected) DeepTeal else TextPrimary,
                                        maxLines = 2
                                    )
                                }
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    Button(
                        onClick = { step = 2 },
                        enabled = selectedCauses.isNotEmpty(),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(50.dp),
                        shape = RoundedCornerShape(16.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = DeepTeal)
                    ) {
                        Text("Next: Daily Goal", fontSize = 14.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }

            2 -> {
                // Step 2: Daily Target Selection
                Column(
                    modifier = Modifier.fillMaxSize(),
                    verticalArrangement = Arrangement.SpaceBetween
                ) {
                    Column {
                        Text(
                            text = "Step 2 of 3",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = DeepTeal
                        )
                        Text(
                            text = "Set your daily impact target",
                            fontSize = 24.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary
                        )
                        Text(
                            text = "Small consistent actions create unstoppable momentum.",
                            fontSize = 13.sp,
                            color = TextSecondary,
                            modifier = Modifier.padding(top = 4.dp, bottom = 24.dp)
                        )

                        listOf(
                            Triple(5, "Light Explorer (5 mins/day)", "Perfect for quick daily habit checks and quizzes."),
                            Triple(15, "Active Changemaker (15 mins/day)", "Balanced pace: micro-cleanups, 2FA audits, and habit logs."),
                            Triple(30, "Community Leader (30 mins/day)", "High impact: organizing campaigns, peer mentoring, and civic reports.")
                        ).forEach { (mins, title, desc) ->
                            val isSelected = targetMinutes == mins
                            Card(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 8.dp)
                                    .clickable { targetMinutes = mins },
                                shape = RoundedCornerShape(20.dp),
                                colors = CardDefaults.cardColors(
                                    containerColor = if (isSelected) CyanBlueContainer else Color.White
                                ),
                                border = if (isSelected) ButtonDefaults.outlinedButtonBorder.copy(width = 2.dp, brush = Brush.linearGradient(listOf(CyanBlue, DeepTeal))) else null
                            ) {
                                Column(modifier = Modifier.padding(18.dp)) {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Text(
                                            text = title,
                                            fontSize = 15.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = if (isSelected) CyanBlueDark else TextPrimary
                                        )
                                        if (isSelected) {
                                            Icon(
                                                imageVector = Icons.Default.CheckCircle,
                                                contentDescription = null,
                                                tint = CyanBlueDark,
                                                modifier = Modifier.size(20.dp)
                                            )
                                        }
                                    }
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Text(
                                        text = desc,
                                        fontSize = 12.sp,
                                        color = TextSecondary
                                    )
                                }
                            }
                        }
                    }

                    Button(
                        onClick = { step = 3 },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(50.dp),
                        shape = RoundedCornerShape(16.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = DeepTeal)
                    ) {
                        Text("Next: Poster Aesthetic", fontSize = 14.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }

            3 -> {
                // Step 3: Preferred Poster Vibe
                Column(
                    modifier = Modifier.fillMaxSize(),
                    verticalArrangement = Arrangement.SpaceBetween
                ) {
                    Column {
                        Text(
                            text = "Step 3 of 3",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = DeepTeal
                        )
                        Text(
                            text = "Choose your impact poster aesthetic",
                            fontSize = 24.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary
                        )
                        Text(
                            text = "Select your default style for social sharing posters. You can change this anytime.",
                            fontSize = 13.sp,
                            color = TextSecondary,
                            modifier = Modifier.padding(top = 4.dp, bottom = 24.dp)
                        )

                        listOf(
                            Triple("Vibrant Modern", "High-energy gradients, bold headlines, neon accent tags.", ElectricCoral),
                            Triple("Clean Minimalist", "Crisp white space, elegant typography, structured cards.", DeepTeal),
                            Triple("Bold Infographic", "Data rings, structured progress bars, high contrast.", CyanBlue)
                        ).forEach { (vibe, desc, accent) ->
                            val isSelected = selectedVibe == vibe
                            Card(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 8.dp)
                                    .clickable { selectedVibe = vibe },
                                shape = RoundedCornerShape(20.dp),
                                colors = CardDefaults.cardColors(
                                    containerColor = if (isSelected) Color.White else Color.White.copy(alpha = 0.7f)
                                ),
                                border = if (isSelected) ButtonDefaults.outlinedButtonBorder.copy(width = 2.5.dp, brush = Brush.linearGradient(listOf(accent, SunYellow))) else null
                            ) {
                                Row(
                                    modifier = Modifier.padding(18.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Box(
                                        modifier = Modifier
                                            .size(44.dp)
                                            .clip(RoundedCornerShape(12.dp))
                                            .background(accent.copy(alpha = 0.15f)),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Icon(
                                            imageVector = Icons.Default.Palette,
                                            contentDescription = null,
                                            tint = accent,
                                            modifier = Modifier.size(24.dp)
                                        )
                                    }
                                    Spacer(modifier = Modifier.width(14.dp))
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(
                                            text = vibe,
                                            fontSize = 15.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = TextPrimary
                                        )
                                        Text(
                                            text = desc,
                                            fontSize = 12.sp,
                                            color = TextSecondary
                                        )
                                    }
                                }
                            }
                        }
                    }

                    Button(
                        onClick = {
                            val updatedProfile = currentProfile.copy(
                                displayName = displayName,
                                isGoogleUser = isGoogleUser,
                                isGuestMode = !isGoogleUser,
                                isOnboardingCompleted = true,
                                selectedCauses = selectedCauses.toList(),
                                dailyTargetMinutes = targetMinutes,
                                preferredPosterVibe = selectedVibe
                            )
                            onCompleteOnboarding(updatedProfile)
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(52.dp),
                        shape = RoundedCornerShape(16.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = ElectricCoral)
                    ) {
                        Text("Launch CHANGE360", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = Color.White)
                    }
                }
            }
        }
    }
}

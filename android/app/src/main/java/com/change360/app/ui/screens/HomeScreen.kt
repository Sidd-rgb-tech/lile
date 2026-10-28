package com.change360.app.ui.screens

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
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
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.change360.app.data.model.AwarenessCategory
import com.change360.app.ui.theme.*
import com.change360.app.viewmodel.Change360ViewModel

@Composable
fun HomeScreen(
    viewModel: Change360ViewModel,
    onNavigateToAssistant: () -> Unit,
    onNavigateToChallenges: () -> Unit,
    onNavigateToImpact: () -> Unit,
    onNavigateToPoster: () -> Unit,
    onNavigateToCampaigns: () -> Unit,
    onNavigateToProfile: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()
    var dailyActionDone by remember { mutableStateOf(false) }

    val completedChallengesCount = uiState.challenges.count { it.status == com.change360.app.data.model.ChallengeStatus.COMPLETED }
    val unlockedBadgesCount = uiState.badges.count { it.isUnlocked }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(LightBackground)
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(top = 16.dp, bottom = 90.dp)
    ) {
        // Vibrant Welcome Header
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = NeonMintContainer
                        ) {
                            Text(
                                text = if (uiState.userProfile.isGoogleUser) "GOOGLE VERIFIED" else "GUEST DEMO",
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp),
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Black,
                                color = DeepTeal
                            )
                        }
                    }
                    Text(
                        text = "Hello, ${uiState.userProfile.displayName}",
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Black,
                        color = TextPrimary
                    )
                    Text(
                        text = "Turn awareness into positive daily action.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = TextSecondary
                    )
                }

                // Profile Avatar with vibrant ring
                Box(
                    modifier = Modifier
                        .size(46.dp)
                        .clip(CircleShape)
                        .background(
                            Brush.linearGradient(
                                listOf(ElectricCoral, NeonMint, CyanBlue)
                            )
                        )
                        .padding(2.5.dp)
                        .clickable { onNavigateToProfile() },
                    contentAlignment = Alignment.Center
                ) {
                    Surface(
                        modifier = Modifier.fillMaxSize(),
                        shape = CircleShape,
                        color = Color.White
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Text(
                                text = uiState.userProfile.displayName.take(1).uppercase(),
                                fontWeight = FontWeight.Black,
                                fontSize = 18.sp,
                                color = DeepTeal
                            )
                        }
                    }
                }
            }
        }

        // Gamification Highlight Banner with Circular Progress Gauge
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                border = ButtonDefaults.outlinedButtonBorder.copy(
                    width = 1.5.dp,
                    brush = Brush.linearGradient(listOf(DeepTeal.copy(alpha = 0.3f), NeonMint.copy(alpha = 0.3f)))
                )
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(18.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.Stars,
                                contentDescription = null,
                                tint = ElectricCoral,
                                modifier = Modifier.size(20.dp)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = "${uiState.userProfile.totalPoints} Impact Points",
                                fontSize = 20.sp,
                                fontWeight = FontWeight.Black,
                                color = TextPrimary
                            )
                        }

                        Text(
                            text = "${uiState.userProfile.currentStreakDays}-day streak • Target: ${uiState.userProfile.dailyTargetMinutes} mins/day",
                            fontSize = 12.sp,
                            color = TextSecondary,
                            modifier = Modifier.padding(top = 4.dp)
                        )
                    }

                    // Circular Progress Gauge
                    Box(contentAlignment = Alignment.Center) {
                        CircularProgressIndicator(
                            progress = { ((uiState.userProfile.totalPoints % 200) / 200f).coerceIn(0.1f, 1f) },
                            modifier = Modifier.size(54.dp),
                            color = NeonMintDark,
                            trackColor = NeonMintContainer,
                            strokeWidth = 6.dp,
                            strokeCap = StrokeCap.Round
                        )
                        Text(
                            text = "${unlockedBadgesCount}/10",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary
                        )
                    }
                }
            }
        }

        // Daily Action Card (Electric Coral & Sun Yellow accents)
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                border = ButtonDefaults.outlinedButtonBorder.copy(
                    width = 1.dp,
                    color = LightSurfaceBorder
                )
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(32.dp)
                                    .clip(RoundedCornerShape(10.dp))
                                    .background(SunYellowContainer),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Lightbulb,
                                    contentDescription = null,
                                    tint = Color(0xFFD97706),
                                    modifier = Modifier.size(18.dp)
                                )
                            }
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "Today's Micro-Action",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = TextPrimary
                            )
                        }

                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = ElectricCoralContainer
                        ) {
                            Text(
                                text = "+30 pts",
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp),
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = ElectricCoral
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    Text(
                        text = "Carry a reusable bottle today and decline single-use cups. Every refill prevents micro-plastics from reaching local waterways.",
                        fontSize = 13.sp,
                        color = TextSecondary,
                        lineHeight = 18.sp
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    BouncyButton(
                        onClick = {
                            if (!dailyActionDone) {
                                dailyActionDone = true
                                onNavigateToChallenges()
                            }
                        },
                        modifier = Modifier.fillMaxWidth(),
                        containerColor = if (dailyActionDone) NeonMintDark else DeepTeal
                    ) {
                        Text(
                            text = if (dailyActionDone) "Action Completed! ✓" else "Start Today's Action",
                            color = Color.White,
                            fontWeight = FontWeight.Bold,
                            fontSize = 13.sp
                        )
                    }
                }
            }
        }

        // Quick Access Cards Grid
        item {
            Text(
                text = "Explore & Take Action",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = TextPrimary
            )
            Spacer(modifier = Modifier.height(8.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                VibrantShortcutCard(
                    modifier = Modifier.weight(1f),
                    title = "AI Guide",
                    subtitle = "4 Smart Modes",
                    icon = Icons.Default.Psychology,
                    accent = CyanBlue,
                    bg = CyanBlueContainer,
                    onClick = onNavigateToAssistant
                )
                VibrantShortcutCard(
                    modifier = Modifier.weight(1f),
                    title = "Make Poster",
                    subtitle = "8 Styles",
                    icon = Icons.Default.Palette,
                    accent = ElectricCoral,
                    bg = ElectricCoralContainer,
                    onClick = onNavigateToPoster
                )
                VibrantShortcutCard(
                    modifier = Modifier.weight(1f),
                    title = "Campaigns",
                    subtitle = "Community",
                    icon = Icons.Default.Campaign,
                    accent = DeepTeal,
                    bg = DeepTealContainer,
                    onClick = onNavigateToCampaigns
                )
            }
        }

        // 20 Categories Explorer Chips
        item {
            Text(
                text = "Focus Causes (20 Areas)",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = TextPrimary
            )
            Spacer(modifier = Modifier.height(8.dp))
            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                items(AwarenessCategory.entries) { cat ->
                    Surface(
                        modifier = Modifier
                            .clip(RoundedCornerShape(12.dp))
                            .clickable {
                                viewModel.setCategoryFilter(cat)
                                onNavigateToChallenges()
                            },
                        shape = RoundedCornerShape(12.dp),
                        color = Color.White,
                        border = ButtonDefaults.outlinedButtonBorder.copy(width = 1.dp, color = LightSurfaceBorder)
                    ) {
                        Text(
                            text = cat.displayName,
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
                            fontSize = 12.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = DeepTeal
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun VibrantShortcutCard(
    modifier: Modifier = Modifier,
    title: String,
    subtitle: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    accent: Color,
    bg: Color,
    onClick: () -> Unit
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    val scale by animateFloatAsState(if (isPressed) 0.94f else 1f, label = "bounce")

    Card(
        modifier = modifier
            .scale(scale)
            .clickable(interactionSource = interactionSource, indication = null) { onClick() }
            .height(105.dp),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        border = ButtonDefaults.outlinedButtonBorder.copy(width = 1.dp, color = LightSurfaceBorder)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(12.dp),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Box(
                modifier = Modifier
                    .size(38.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(bg),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = title,
                    tint = accent,
                    modifier = Modifier.size(20.dp)
                )
            }
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                text = title,
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                color = TextPrimary
            )
            Text(
                text = subtitle,
                fontSize = 10.sp,
                color = TextSecondary
            )
        }
    }
}

@Composable
fun BouncyButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    containerColor: Color = DeepTeal,
    content: @Composable RowScope.() -> Unit
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    val scale by animateFloatAsState(if (isPressed) 0.95f else 1f, label = "bounce")

    Button(
        onClick = onClick,
        modifier = modifier.scale(scale),
        shape = RoundedCornerShape(14.dp),
        colors = ButtonDefaults.buttonColors(containerColor = containerColor),
        content = content
    )
}

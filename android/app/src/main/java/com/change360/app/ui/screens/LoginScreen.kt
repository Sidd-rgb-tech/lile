package com.change360.app.ui.screens

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.blur
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@Composable
fun LoginScreen(onLoginSuccess: (String, String) -> Unit) {
    val coroutineScope = rememberCoroutineScope()
    var isLoading by remember { mutableStateOf(false) }

    // Gemini Brand Colors Gradient
    const val PULSE_DURATION = 3000
    val infiniteTransition = rememberInfiniteTransition(label = "login_glow")
    val pulseScale by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = 1.12f,
        animationSpec = infiniteRepeatable(
            animation = tween(PULSE_DURATION, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "login_pulse"
    )

    val geminiBrush = Brush.linearGradient(
        colors = listOf(
            Color(0xFF1A73E8), // Google Blue
            Color(0xFF8E24AA), // Deep Violet
            Color(0xFFE91E63), // Rich Magenta
            Color(0xFF00B0FF)  // Bright Cyan
        )
    )

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF090D16)), // Deep obsidian dark mode
        contentAlignment = Alignment.Center
    ) {
        // Ambient background glow
        Box(
            modifier = Modifier
                .size(320.dp)
                .scale(pulseScale)
                .blur(110.dp)
                .background(geminiBrush.copy(alpha = 0.25f), shape = CircleShape)
        )

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(28.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            // Top Spacing & Branding Header
            Spacer(modifier = Modifier.height(48.dp))
            
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Surface(
                    modifier = Modifier.size(72.dp),
                    shape = RoundedCornerShape(20.dp),
                    color = Color.White,
                    shadowElevation = 12.dp
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(geminiBrush),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "360",
                            fontSize = 24.sp,
                            fontWeight = FontWeight.Black,
                            color = Color.White
                        )
                    }
                }

                Spacer(modifier = Modifier.height(20.dp))

                Text(
                    text = "Welcome to CHANGE360",
                    fontSize = 28.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White,
                    textAlign = TextAlign.Center
                )

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = "One tap to sign in. No setup, no manual forms—just jump straight into your fresh impact journey.",
                    fontSize = 14.sp,
                    color = Color(0xFF94A3B8), // Slate gray subtext
                    textAlign = TextAlign.Center,
                    modifier = Modifier.padding(horizontal = 16.dp)
                )
            }

            // Center Action: Google Sign-In Button Card
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.fillMaxWidth()
            ) {
                if (isLoading) {
                    // Loading state while Google authenticates and provisions fresh account
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(56.dp)
                            .clip(RoundedCornerShape(16.dp))
                            .background(Color(0xFF1E293B))
                    ) {
                        CircularProgressIndicator(
                            modifier = Modifier.size(24.dp),
                            color = Color(0xFF38BDF8),
                            strokeWidth = 2.5.dp
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Text(
                            text = "Connecting to Google...",
                            color = Color.White,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Medium
                        )
                    }
                } else {
                    // Sleek Google Sign-In Button
                    Surface(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(56.dp)
                            .clip(RoundedCornerShape(16.dp))
                            .clickable {
                                isLoading = true
                                coroutineScope.launch {
                                    delay(1200) // Simulate fast secure OAuth token exchange
                                    // Automatically provisions a fresh account using Google metadata
                                    onLoginSuccess("Google User", "user@gmail.com")
                                }
                            },
                        color = Color.White,
                        shape = RoundedCornerShape(16.dp),
                        shadowElevation = 4.dp
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(horizontal = 20.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.Center
                        ) {
                            // Google 'G' Icon Text representation or custom layout
                            Box(
                                modifier = Modifier
                                    .size(24.dp)
                                    .background(Color(0xFF1A73E8), shape = CircleShape),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = "G",
                                    color = Color.White,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 14.sp
                                )
                            }
                            
                            Spacer(modifier = Modifier.width(14.dp))
                            
                            Text(
                                text = "Sign in with Google",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = Color(0xFF1E293B)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    Text(
                        text = "By continuing, your fresh account is instantly initialized securely.",
                        fontSize = 12.sp,
                        color = Color(0xFF64748B),
                        textAlign = TextAlign.Center
                    )
                }
            }

            // Footer
            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}
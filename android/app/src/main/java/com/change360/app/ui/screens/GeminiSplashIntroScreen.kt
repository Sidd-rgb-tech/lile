package com.change360.app.ui.screens

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.blur
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay

@Composable
fun GeminiSplashIntroScreen(onAnimationFinished: () -> Unit) {
    var startAnimation by remember { mutableStateOf(false) }

    // Smooth entry scale & opacity animation
    val scaleAnim = animateFloatAsState(
        targetValue = if (startAnimation) 1f else 0.8f,
        animationSpec = spring(
            dampingRatio = Spring.DampingRatioMediumBouncy,
            stiffness = Spring.StiffnessLow
        ),
        label = "splash_scale"
    )

    // Infinite pulsing glow for the Gemini AI aura backdrop
    val infiniteTransition = rememberInfiniteTransition(label = "gemini_glow")
    val pulseScale by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = 1.15f,
        animationSpec = infiniteRepeatable(
            animation = tween(2000, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "pulse_scale"
    )

    LaunchedEffect(Unit) {
        startAnimation = true
        delay(2400) // Display stunning splash for 2.4 seconds then transition to login
        onAnimationFinished()
    }

    // Gemini AI Brand Colors Gradient (Blue -> Purple -> Magenta -> Cyan)
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
            .background(Color(0xFF090D16)), // Deep obsidian dark mode backdrop
        contentAlignment = Alignment.Center
    ) {
        // Glowing Background Aura Blur
        Box(
            modifier = Modifier
                .size(280.dp)
                .scale(pulseScale)
                .blur(90.dp)
                .background(geminiBrush, shape = CircleShape)
        )

        // Central Content Card
        Column(
            modifier = Modifier
                .scale(scaleAnim.value)
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // Glowing Icon Emblem
            Surface(
                modifier = Modifier.size(84.dp),
                shape = RoundedCornerShape(24.dp),
                color = Color.White,
                shadowElevation = 16.dp
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(geminiBrush),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "360",
                        fontSize = 28.sp,
                        fontWeight = FontWeight.Black,
                        color = Color.White
                    )
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            Text(
                text = "CHANGE360",
                fontSize = 32.sp,
                fontWeight = FontWeight.Black,
                color = Color.White,
                letterSpacing = 1.5.sp
            )

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "Learn. Act. Track. Inspire.",
                fontSize = 14.sp,
                fontWeight = FontWeight.SemiBold,
                color = Color(0xFF38BDF8) // Light Cyan Accent
            )

            Spacer(modifier = Modifier.height(32.dp))

            // Subtle loading indicator bar
            Box(
                modifier = Modifier
                    .width(120.dp)
                    .height(3.dp)
                    .background(Color.White.copy(alpha = 0.2f), shape = CircleShape)
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxHeight()
                        .fillMaxWidth(0.6f)
                        .background(geminiBrush, shape = CircleShape)
                )
            }
        }
    }
}
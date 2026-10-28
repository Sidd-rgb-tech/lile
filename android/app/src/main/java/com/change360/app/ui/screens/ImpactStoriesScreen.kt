package com.change360.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material.icons.filled.BookmarkBorder
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.change360.app.data.model.AwarenessCategory
import com.change360.app.data.model.ImpactStory

@Composable
fun ImpactStoriesScreen(onOpenChallenge: () -> Unit) {
    var stories by remember {
        mutableStateOf(
            listOf(
                ImpactStory(
                    id = "s1",
                    title = "How Lincoln High School Cut Single-Use Plastic by 85%",
                    category = AwarenessCategory.WASTE_MANAGEMENT,
                    summary = "A student-led eco-club introduced refill stations and audit scorecards, saving thousands of plastic bottles per semester.",
                    actionTaken = "Installed filtered water taps and distributed branded reusable stainless steel flasks to all incoming freshmen.",
                    lessonsLearned = "Convenience drives behavior change: making refills easier than vending machines was the key breakthrough.",
                    suggestedActionForReader = "Advocate for a dedicated water refill station at your school or office."
                ),
                ImpactStory(
                    id = "s2",
                    title = "Empowering Seniors with Scam Defense Workshops",
                    category = AwarenessCategory.DIGITAL_SAFETY,
                    summary = "College volunteers hosted weekly 1-on-1 coaching for elderly community members on detecting smishing and phishing.",
                    actionTaken = "Demonstrated simulated scam messages and configured call-blocking filters on 120+ senior phones.",
                    lessonsLearned = "Patience and non-judgmental guidance remove the shame that scammers prey upon.",
                    suggestedActionForReader = "Check in on an older relative today and review their SMS security settings."
                )
            )
        )
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.surface)
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp),
        contentPadding = PaddingValues(top = 16.dp, bottom = 90.dp)
    ) {
        item {
            Text(
                text = "Impact Stories & Inspiration",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = "Real community initiatives turning social awareness into durable positive action.",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }

        items(stories) { story ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = story.category.displayName,
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.primary
                        )
                        IconButton(onClick = {
                            stories = stories.map {
                                if (it.id == story.id) it.copy(isFavorited = !it.isFavorited) else it
                            }
                        }) {
                            Icon(
                                imageVector = if (story.isFavorited) Icons.Default.Bookmark else Icons.Default.BookmarkBorder,
                                contentDescription = "Save Story",
                                tint = if (story.isFavorited) MaterialTheme.colorScheme.primary else Color.Gray
                            )
                        }
                    }
                    Text(
                        text = story.title,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = story.summary,
                        style = MaterialTheme.typography.bodySmall
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        text = "Takeaway:\n${story.lessonsLearned}",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.primary
                    )
                }
            }
        }
    }
}

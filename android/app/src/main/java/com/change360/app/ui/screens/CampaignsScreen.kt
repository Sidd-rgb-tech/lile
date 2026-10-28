package com.change360.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Campaign
import androidx.compose.material.icons.filled.Palette
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.change360.app.data.model.AwarenessCategory
import com.change360.app.data.model.Campaign

@Composable
fun CampaignsScreen(onNavigateToPoster: () -> Unit) {
    var campaigns by remember {
        mutableStateOf(
            listOf(
                Campaign(
                    id = "c1",
                    title = "City-Wide Plastic-Free Campus Drive",
                    category = AwarenessCategory.WASTE_MANAGEMENT,
                    description = "Educational institutions unite to eliminate single-use beverage containers and audit canteen plastics.",
                    objectives = listOf("Eliminate 5,000 single-use cups", "Install 12 new water refill stations"),
                    durationText = "Active • 14 days remaining",
                    participantCount = 342,
                    suggestedActions = listOf("Carry reusable bottle", "Conduct campus audit")
                ),
                Campaign(
                    id = "c2",
                    title = "Digital Safety & Anti-Bullying Week",
                    category = AwarenessCategory.DIGITAL_SAFETY,
                    description = "Equipping teens and families with cyber hygiene, anti-phishing knowledge, and compassionate online communication.",
                    objectives = listOf("100% 2FA activation in classrooms", "Zero tolerance cyberbullying pledge"),
                    durationText = "Starts Monday • 7 days",
                    participantCount = 518,
                    suggestedActions = listOf("Enable 2FA", "Share safety checklist")
                ),
                Campaign(
                    id = "c3",
                    title = "Safe Crossings & Vision Zero Initiative",
                    category = AwarenessCategory.ROAD_SAFETY,
                    description = "Promoting pedestrian priority zones around local schools and community parks.",
                    objectives = listOf("Survey 15 crosswalks", "Distribute reflective safety tags"),
                    durationText = "Ongoing • Community Driven",
                    participantCount = 205,
                    suggestedActions = listOf("Commit to distraction-free crossing", "Report damaged signs")
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
                text = "Community & School Campaigns",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = "Join collective movements and record real community participation.",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }

        items(campaigns) { campaign ->
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
                            text = campaign.category.displayName,
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.primary
                        )
                        Text(
                            text = "${campaign.participantCount} Participants",
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = campaign.title,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = campaign.description,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Button(
                            onClick = {
                                campaigns = campaigns.map {
                                    if (it.id == campaign.id) it.copy(isJoined = !it.isJoined) else it
                                }
                            },
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Text(if (campaign.isJoined) "Joined ✓" else "Join Campaign")
                        }

                        OutlinedButton(
                            onClick = onNavigateToPoster,
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Icon(Icons.Default.Palette, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("Make Poster", fontSize = 12.sp)
                        }
                    }
                }
            }
        }
    }
}

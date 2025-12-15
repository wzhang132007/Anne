#!/usr/bin/env python3
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
import matplotlib.lines as mlines

# Set up the figure
fig, ax = plt.subplots(figsize=(20, 26))
ax.set_xlim(0, 20)
ax.set_ylim(0, 26)
ax.axis('off')
fig.patch.set_facecolor('white')

# Color scheme
primary_color = '#67D89D'
white = '#FFFFFF'

def create_box(ax, x, y, width, height, text, style='normal', fontsize=9):
    """Create a rounded box with text"""
    if style == 'central':
        box = FancyBboxPatch((x - width/2, y - height/2), width, height,
                            boxstyle="round,pad=0.1",
                            edgecolor=primary_color, facecolor=white,
                            linewidth=4, zorder=2)
        text_color = primary_color
        weight = 'bold'
        fontsize = 16
    elif style == 'flow-title':
        box = FancyBboxPatch((x - width/2, y - height/2), width, height,
                            boxstyle="round,pad=0.08",
                            edgecolor=white, facecolor=primary_color,
                            linewidth=3, zorder=2)
        text_color = white
        weight = 'bold'
        fontsize = 11
    else:  # step
        box = FancyBboxPatch((x - width/2, y - height/2), width, height,
                            boxstyle="round,pad=0.05",
                            edgecolor=primary_color, facecolor=primary_color,
                            alpha=0.85, linewidth=1, zorder=2)
        text_color = white
        weight = 'normal'
        fontsize = 8

    ax.add_patch(box)
    ax.text(x, y, text, ha='center', va='center', fontsize=fontsize,
            color=text_color, weight=weight, zorder=3, wrap=True)
    return box

def draw_line(ax, x1, y1, x2, y2, style='normal'):
    """Draw connecting line"""
    if style == 'flow':
        line = mlines.Line2D([x1, x2], [y1, y2], color=primary_color,
                           linewidth=2.5, alpha=0.5, zorder=1)
    else:
        line = mlines.Line2D([x1, x2], [y1, y2], color=primary_color,
                           linewidth=1.5, alpha=0.3, zorder=1)
    ax.add_line(line)

# Central node
create_box(ax, 10, 24, 3, 1.2,
          'PathAble\nAccessibility-First Navigation',
          style='central')

# Flow positions
flow1_x, flow1_y = 5, 20
flow2_x, flow2_y = 15, 20
flow3_x, flow3_y = 3, 15
flow4_x, flow4_y = 10, 15
flow5_x, flow5_y = 17, 15
flow6_x, flow6_y = 5, 9
flow7_x, flow7_y = 15, 9
flow8_x, flow8_y = 10, 3

# Draw main flow connections
draw_line(ax, 10, 23, flow1_x, flow1_y + 0.5, 'flow')
draw_line(ax, 10, 23, flow2_x, flow2_y + 0.5, 'flow')
draw_line(ax, 10, 23, flow3_x, flow3_y + 0.5, 'flow')
draw_line(ax, 10, 23, flow4_x, flow4_y + 0.5, 'flow')
draw_line(ax, 10, 23, flow5_x, flow5_y + 0.5, 'flow')
draw_line(ax, 10, 23, flow6_x, flow6_y + 0.5, 'flow')
draw_line(ax, 10, 23, flow7_x, flow7_y + 0.5, 'flow')
draw_line(ax, 10, 23, flow8_x, flow8_y + 0.5, 'flow')

# Flow 1: Onboarding
create_box(ax, flow1_x, flow1_y, 2.8, 0.6,
          'Flow 1: First-Time\nOnboarding', style='flow-title')
y_pos = flow1_y - 1.5
create_box(ax, flow1_x, y_pos, 2.6, 0.9,
          'Step 1: App Launch\n"Safe, step-free navigation"\nEstablish trust immediately', style='step')
draw_line(ax, flow1_x, flow1_y - 0.4, flow1_x, y_pos + 0.5)
y_pos -= 1.5
create_box(ax, flow1_x, y_pos, 2.6, 0.8,
          'Step 2: Account Creation\nMinimal input required\nLow friction setup', style='step')
draw_line(ax, flow1_x, y_pos + 1.15, flow1_x, y_pos + 0.5)
y_pos -= 1.7
create_box(ax, flow1_x, y_pos, 2.6, 1.1,
          'Step 3: Mobility Profile\nSelect mobility needs\nSet routing constraints\n"No need to explain every time"', style='step')
draw_line(ax, flow1_x, y_pos + 1.4, flow1_x, y_pos + 0.6)
y_pos -= 1.5
create_box(ax, flow1_x, y_pos, 2.6, 0.9,
          'Step 4: Confirmation\nReview preferences\n"Routes may be longer but safer"', style='step')
draw_line(ax, flow1_x, y_pos + 1.15, flow1_x, y_pos + 0.5)

# Flow 2: Navigation
create_box(ax, flow2_x, flow2_y, 2.8, 0.6,
          'Flow 2: Start\nNavigation', style='flow-title')
y_pos = flow2_y - 1.5
create_box(ax, flow2_x, y_pos, 2.6, 0.9,
          'Step 1: Destination Search\nEnter destination\n"Safest route for your needs"', style='step')
draw_line(ax, flow2_x, flow2_y - 0.4, flow2_x, y_pos + 0.5)
y_pos -= 1.5
create_box(ax, flow2_x, y_pos, 2.6, 1.0,
          'Step 2: Route Preview\nStep-free route by default\nSafety score, incline, crossings\nView alternatives', style='step')
draw_line(ax, flow2_x, y_pos + 1.15, flow2_x, y_pos + 0.5)
y_pos -= 1.7
create_box(ax, flow2_x, y_pos, 2.6, 0.9,
          'Step 3: Route Selection\nConfirm route\nPredictability over speed', style='step')
draw_line(ax, flow2_x, y_pos + 1.35, flow2_x, y_pos + 0.5)
y_pos -= 1.5
create_box(ax, flow2_x, y_pos, 2.6, 0.9,
          'Step 4: Turn-by-Turn\nClear visual instructions\nVoice + haptic cues\nMonitor hazards', style='step')
draw_line(ax, flow2_x, y_pos + 1.15, flow2_x, y_pos + 0.5)

# Flow 3: Obstacle Handling
create_box(ax, flow3_x, flow3_y, 2.8, 0.6,
          'Flow 3: En Route &\nObstacles', style='flow-title')
y_pos = flow3_y - 1.5
create_box(ax, flow3_x, y_pos, 2.6, 0.9,
          'Step 1: Real-Time Monitor\nCommunity-reported obstacles\nConstruction, broken sidewalks', style='step')
draw_line(ax, flow3_x, flow3_y - 0.4, flow3_x, y_pos + 0.5)
y_pos -= 1.5
create_box(ax, flow3_x, y_pos, 2.6, 1.0,
          'Step 2: Alert & Reroute\n"Obstacle ahead—rerouting"\nAuto-reroute step-free\nNo backtracking needed', style='step')
draw_line(ax, flow3_x, y_pos + 1.15, flow3_x, y_pos + 0.5)
y_pos -= 1.5
create_box(ax, flow3_x, y_pos, 2.6, 0.7,
          'Step 3: Confirmation\nAccept reroute\nView reason', style='step')
draw_line(ax, flow3_x, y_pos + 1.15, flow3_x, y_pos + 0.4)

# Flow 4: Crossing
create_box(ax, flow4_x, flow4_y, 2.8, 0.6,
          'Flow 4: Crossing\nAssistance', style='flow-title')
y_pos = flow4_y - 1.5
create_box(ax, flow4_x, y_pos, 2.6, 0.9,
          'Step 1: Approaching\nCountdown timer\n"Safe to Cross" / "Please Wait"', style='step')
draw_line(ax, flow4_x, flow4_y - 0.4, flow4_x, y_pos + 0.5)
y_pos -= 1.5
create_box(ax, flow4_x, y_pos, 2.6, 0.9,
          'Step 2: Multimodal Guide\nVisual countdown\nAudio cues\nHaptic vibration', style='step')
draw_line(ax, flow4_x, y_pos + 1.15, flow4_x, y_pos + 0.5)
y_pos -= 1.5
create_box(ax, flow4_x, y_pos, 2.6, 0.8,
          'Step 3: Completion\n"Crossing completed safely"\nReduce stress', style='step')
draw_line(ax, flow4_x, y_pos + 1.15, flow4_x, y_pos + 0.4)

# Flow 5: Arrival
create_box(ax, flow5_x, flow5_y, 2.8, 0.6,
          'Flow 5: Arrival &\nSummary', style='flow-title')
y_pos = flow5_y - 1.5
create_box(ax, flow5_x, y_pos, 2.6, 0.7,
          'Step 1: Arrival\nReach destination\nConfirm arrival', style='step')
draw_line(ax, flow5_x, flow5_y - 0.4, flow5_x, y_pos + 0.4)
y_pos -= 1.4
create_box(ax, flow5_x, y_pos, 2.6, 0.9,
          'Step 2: Journey Summary\nDistance, time\nSafety score\nDifficulty ratings', style='step')
draw_line(ax, flow5_x, y_pos + 1.05, flow5_x, y_pos + 0.5)
y_pos -= 1.4
create_box(ax, flow5_x, y_pos, 2.6, 0.7,
          'Step 3: Reflection\n"How was your journey?"\n👍 😐 👎', style='step')
draw_line(ax, flow5_x, y_pos + 1.05, flow5_x, y_pos + 0.4)

# Flow 6: Hazard Reporting
create_box(ax, flow6_x, flow6_y, 2.8, 0.6,
          'Flow 6: Hazard\nReporting', style='flow-title')
y_pos = flow6_y - 1.5
create_box(ax, flow6_x, y_pos, 2.6, 0.9,
          'Step 1: Report Trigger\n"Report Hazard"\nStairs, blocked paths, etc.', style='step')
draw_line(ax, flow6_x, flow6_y - 0.4, flow6_x, y_pos + 0.5)
y_pos -= 1.5
create_box(ax, flow6_x, y_pos, 2.6, 0.9,
          'Step 2: Location & Detail\nAuto-detect location\nSelect hazard type\nOptional photo', style='step')
draw_line(ax, flow6_x, y_pos + 1.15, flow6_x, y_pos + 0.5)
y_pos -= 1.5
create_box(ax, flow6_x, y_pos, 2.6, 0.9,
          'Step 3: Submission\nStatus: "Pending"\nVerified after multiple reports\nMaintain trust', style='step')
draw_line(ax, flow6_x, y_pos + 1.15, flow6_x, y_pos + 0.5)

# Flow 7: Community Map
create_box(ax, flow7_x, flow7_y, 2.8, 0.6,
          'Flow 7: Community\nMap', style='flow-title')
y_pos = flow7_y - 1.5
create_box(ax, flow7_x, y_pos, 2.6, 0.9,
          'Step 1: Open Map\nView nearby reports\nFilter by hazard type, time', style='step')
draw_line(ax, flow7_x, flow7_y - 0.4, flow7_x, y_pos + 0.5)
y_pos -= 1.5
create_box(ax, flow7_x, y_pos, 2.6, 0.9,
          'Step 2: Impact Feedback\nSee contribution impact\n"Helped 12 people avoid route"', style='step')
draw_line(ax, flow7_x, y_pos + 1.15, flow7_x, y_pos + 0.5)

# Flow 8: History
create_box(ax, flow8_x, flow8_y, 2.8, 0.6,
          'Flow 8: Journey\nHistory', style='flow-title')
y_pos = flow8_y - 1.5
create_box(ax, flow8_x, y_pos, 2.6, 0.8,
          'Step 1: View History\nView past trips\nSafety score, difficulty, notes', style='step')
draw_line(ax, flow8_x, flow8_y - 0.4, flow8_x, y_pos + 0.4)
y_pos -= 1.4
create_box(ax, flow8_x, y_pos, 2.6, 0.7,
          'Step 2: Personalization\nUpdate mobility needs\nSystem adapts routing', style='step')
draw_line(ax, flow8_x, y_pos + 1.05, flow8_x, y_pos + 0.4)

# End State
end_box = FancyBboxPatch((10 - 2.5, 0.3), 5, 1.2,
                        boxstyle="round,pad=0.1",
                        edgecolor=primary_color, facecolor=white,
                        linewidth=4, zorder=2)
ax.add_patch(end_box)
ax.text(10, 1.2, 'End State', ha='center', va='center',
        fontsize=13, color=primary_color, weight='bold', zorder=3)
ax.text(10, 0.7, 'User feels: Safer • More Confident • Independent\nUncertainty → Predictability → Independence',
        ha='center', va='center', fontsize=10, color=primary_color, zorder=3)

# Save the figure
plt.tight_layout()
plt.savefig('/home/user/Anne/pathable-mindmap.png', dpi=300, bbox_inches='tight',
            facecolor='white', edgecolor='none')
print("Mind map saved as pathable-mindmap.png")
plt.close()

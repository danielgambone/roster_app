select player_name,position,CAST(jersey_number AS INTEGER) AS jersey_number,week,headshot_url,
case
    when position = 'QB' then 'Offense'
    when position = 'RB' then 'Offense'
    when position = 'WR' then 'Offense'
    when position = 'TE' then 'Offense'
    when position = 'K' then 'Special Teams'
    when position = 'P' then 'Special Teams'
    when position = 'LS' then 'Special Teams'
    when position = 'OL' then 'Offense'
    when position = 'DL' then 'Defense'
    when position = 'LB' then 'Defense'
    when position = 'DB' then 'Defense'
end as team_side
from browns_roster;


select distinct position
from browns_roster;
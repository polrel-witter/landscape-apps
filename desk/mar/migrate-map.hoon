/-  g=groups
/+  j=groups-json
|_  flags=(map flag:g ?)
++  grad  %noun
++  grow
  |%
  ++  noun  flags
  ++  json
    |=  fs=(map flag:g ?)
    =,  enjs:format
    %-  pairs
    %+  turn  ~(tap by fs)
    |=  [f=flag:g mig=?]
    [s+(rap 3 (scot %p p.f) '/' q.f ~) b+mig]
  --
++  grab
  |%
  ++  noun  (map flag:g ?)
  --
--
